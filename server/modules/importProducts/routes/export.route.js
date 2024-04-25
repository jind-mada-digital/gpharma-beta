const express = require("express");
const ImportRouter = express.Router();
//const Authentification = require("../../../middlewares/Authentification.middleware.js");
const exportController = require('../controllers/export.controller.js');

// Define the route for importing products from an Excel file
ImportRouter.post('/export', exportController.exportProducts);
ImportRouter.get('/export', (req, res) => {
    const html = `
        <html>
            <head>
                <title>Export Page</title>
            </head>
            <body>
                <h1>Test Export</h1>
                <form method="post" action="/modules/product-import-export/export" enctype="multipart/form-data">
                    <div>
                        <label>Data: </label><select name="dataType"><option value="Product">Produit</option></select>
                    </div>
                    <div>
                        <label>Export format: </label><select name="exportFormat"><option value="Excel">Excel</option></select>
                    </div>
                    <input type="submit" value="Export" />
                </form>
            </body>
        </html>
    `;
    
    res.send(html);
});

module.exports = ImportRouter;