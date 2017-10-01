"use strict";

if (Annotator.Plugin) {
    console.log("Annotator.Plugin found");
    Annotator.Plugin.wccs = function (element) {
        console.log("Registering WCCS Plugin");
        let contentClasses = [];
        let referenceClasses = [];

        function requestContentClasses() {
            console.debug("Requesting content classes.");
            jQuery.ajax("http://localhost:44284/content-classes", {
                "success": (data) => {
                    console.debug("Successfully requested content classes.");
                    contentClasses = data.classes;
                },
                "error": (jqXHR, textStatus, error) => {
                    console.error(`Requesting content classes failed: textStatus=${textStatus}, errorThrown=${error}`);
                }
            });
        }

        function requestReferenceClasses() {
            console.debug("Requesting reference classes.");
            jQuery.ajax("http://localhost:44284/reference-classes", {
                "success": (data) => {
                    console.debug("Successfully requested reference classes.");
                    referenceClasses = data.classes;
                },
                "error": (jqXHR, textStatus, error) => {
                    console.error(`Requesting reference classes failed: textStatus=${textStatus}, errorThrown=${error}`);
                }
            });
        }

        requestContentClasses();
        requestReferenceClasses();

        return {
            pluginInit: function () {
                function classFieldLoad(field, annotation, editMode) {
                    console.debug("Loading WCCS plugin field.");
                    if (annotation.wccs.featureKind) {
                        field.innerHTML = "";

                        const container = document.createElement("div");
                        container.style.padding = "12px 8px";

                        const label = document.createElement("label");
                        label.innerHTML = "Class:";
                        label.style.color = "#3c3c3c";

                        if (editMode) {
                            const select = document.createElement("select");
                            select.style.color = "#3c3c3c";

                            const classes = annotation.wccs.featureKind === "property" ? contentClasses : referenceClasses;
                            classes.forEach(aClass => {
                                const option = document.createElement("option");
                                option.value = aClass.name;
                                option.text = aClass.name;
                                option.style.color = "#3c3c3c";
                                select.add(option);
                            });

                            select.value = annotation.wccs.class;

                            field.appendChild(container);
                            container.appendChild(label);
                            container.appendChild(select);
                            select.style.width = "80%";
                            select.style.marginLeft = "10px";
                        } else {
                            const span = document.createElement("span");
                            span.innerText = annotation.wccs.class;
                            span.style.color = "#3c3c3c";
                            field.appendChild(label);
                            field.appendChild(span);
                            label.style.width = "15%";
                            span.style.width = "85%";
                        }
                    }
                }

                console.log("Initializing plugin.");
                this.annotator.viewer.addField({label: "Class", load: (field, annotation) => classFieldLoad(field, annotation, false)});
                this.annotator.editor.addField({
                    label: "Class",
                    load: (field, annotation) => classFieldLoad(field, annotation, true),
                    submit: function (field, annotation) {
                        console.log("In submit");
                        annotation.referenceType = field.getElementsByTagName("select")[0].value;
                    }
                });
            }
        };
    };
} else {
    console.log("Annotator.Plugin found");
}
