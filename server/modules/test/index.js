const express = require("express");
const TestRouter = express.Router();

TestRouter.get('/page-example', (req, res) => {
    const html = `
        <html>
            <head>
                <title>Test Page</title>
            </head>
            <body>
                <h1>Test Module page</h1>
            </body>
        </html>
    `;
    
    res.send(html);
});

module.exports = {
    name: 'Test Module',
    slug: 'test',
    description: 'Module for test purpose on development process',
    routers: [ TestRouter ]
}