"use strict";

if (Annotator.Plugin) {
    console.log("Annotator.Plugin found");
    Annotator.Plugin.wccs = function (element) {
        console.log("Registering WCCS Plugin");
        return {
            pluginInit: function () {
                function classFieldLoad(field, annotation, editMode) {
                    console.log("In pluginInid");
                    if (annotation.wccs.featureKind) {
                        field.innerHTML = "";

                        let container = document.createElement("div");
                        container.style.padding = "12px 8px";

                        let label = document.createElement("label");
                        label.innerHTML = "Class:";
                        label.style.color = "#3c3c3c";

                        let select = document.createElement("select");
                        let newsDetailPageOption = document.createElement("option");
                        newsDetailPageOption.value = "NewsDetailPage";
                        newsDetailPageOption.text = "News Detail Page";
                        select.add(newsDetailPageOption);
                        select.style.color = "#3c3c3c";

                        for (let i = 1; i <= 3; i++) {
                            let option = document.createElement("option");
                            option.value = "type" + i;
                            option.text = "Type " + i;
                            option.style.color = "#3c3c3c";
                            select.add(option);
                        }

                        select.value = annotation.wccs.class;

                        if (editMode) {
                            field.appendChild(container);
                            container.appendChild(label);
                            container.appendChild(select);
                            select.style.width = "80%";
                            select.style.marginLeft = "10px";
                        } else {
                            field.appendChild(label);
                            field.appendChild(select);
                            label.style.width = "15%";
                            select.style.width = "85%";
                        }
                    }
                }

                console.log("In pluginInit");
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
