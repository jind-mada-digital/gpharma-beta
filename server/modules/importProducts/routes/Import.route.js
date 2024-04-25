const express = require("express");
const ImportRouter = express.Router();
//const Authentification = require("../../../middlewares/Authentification.middleware.js");
const importController = require('../controllers/import.controller.js');

// Define the route for importing products from an Excel file
ImportRouter.post('/import', importController.importProducts);
ImportRouter.get('/import', (req, res) => {
    const html = `
        <html>
            <head>
                <title>Import Page</title>
            </head>
            <body>
                <h1>Test Import</h1>
                <form method="post" action="/modules/product-import-export/import" enctype="multipart/form-data">
                    <input type="file" name="import"/>
                    <input type="submit" value="Import" />
                </form>
            </body>
        </html>
    `;
    
    res.send(html);
});
//LoginRouter.get("/logout/:id", Authentification, logout);

module.exports = ImportRouter;