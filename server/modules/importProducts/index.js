const importProductRouter = require('./routes/import.route');
const exportProductRouter = require('./routes/export.route');

// Register the product import module
module.exports = {
    name: 'Product Import/Export',
    slug: 'product-import-export',
    description: 'Module for importing/exporting products',
    routers: [ importProductRouter, exportProductRouter ]
}