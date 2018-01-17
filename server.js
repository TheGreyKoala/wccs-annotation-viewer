"use strict";

const express = require('express');
const unirest = require('unirest');

const app = express();

const headEndReplacement = `<script src="http://assets.annotateit.org/annotator/v1.2.10/annotator-full.js"></script>
    <script src="http://localhost:29136/js/wccs-annotator-plugin-1.0.0/wccs-annotator-plugin.js"></script>
    <link rel="stylesheet" href="http://assets.annotateit.org/annotator/v1.1.0/annotator.min.css">
    <style>
        span.annotator-hl {
            width: initial !important;
            height: initial !important;
            display: initial !important;
            position: initial !important;
            left: initial !important;
            top: initial !important;
            margin-right: initial !important;
            margin-left: initial !important;
            background: rgba(255,255,10,0.3) !important;        
        }
    </style>
    </head>`;

const bodyEndReplacement = url => {
    return `
<script>
jQuery(function ($) {
    const annotator = $(document.body).annotator().data("annotator");
    const encodedUrl = encodeURIComponent("${url}");
    annotator
        .addPlugin("Store", {
            prefix: "http://localhost:16612/pages/" + encodedUrl
        })
        .addPlugin("wccs")
        .addPlugin("Permissions", { user: "editor", permissions: { "admin": ["wccs"] }});
});
</script>
</body>
`;
};

app.get("/", (request, response) => {
    let getPromise = new Promise((resolve, reject) => {
        unirest
            .get(request.query.url)
            .end((wpResponse) => {
                if (wpResponse.ok) {
                    resolve(wpResponse.body);
                } else {
                    reject({"status": wpResponse.status, "body": wpResponse.body});
                }
            });
    });

    getPromise.then(body => {
        let fixedBody = body.replace("</head>", headEndReplacement)
            .replace("</body>", bodyEndReplacement(request.query.url));

        response.status(200).send(fixedBody);
    }, error => {
        response.status(error.status).send(error.body);
    });
});

app.use(express.static("public"));

app.listen(29136, function () {
    console.log("Annotation proxy service started...");
});