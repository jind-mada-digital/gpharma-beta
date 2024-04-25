const venteRouter = require('./routes/venteRoute');

// Register the product import module
module.exports = {
    name: 'Default module',
    slug: 'default',
    description: 'Some feature added related the the initial app feature are addere in this module',
    routers: [ venteRouter ]
}