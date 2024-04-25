const Database = require('../../../config/Database.js');
const ProduitModel = require("../../../database/models/Produit.model.js");

class ProductService {

    constructor(database, produitModel) {
        this.database = database;
        this.produitModel = produitModel;
    }

    /**
     * Import valid products into the database.
     *
     * This method processes an array of valid products and saves them to the database using a transaction.
     *
     * @param {Object[]} validProducts - An array of valid product objects to be imported.
     * @returns {Promise<Object>} A Promise that resolves to an object containing the import status:
     *                            - {success: true, message: 'Import successful'} if the import is successful.
     *                            - {success: false, message: 'Import failed'} if the import fails.
     * @throws {Error} If there is an error during the import process.
     */
    async importProducts( validProducts ) {

        let transaction = null;

        try{
            console.log('Importing ' + validProducts.length +' products...');
            // Process each row of data and save it to the database
            transaction = await this.database.transaction();

            for (const product of validProducts) {
                await this.produitModel.create(product, { transaction });
            }

            await transaction.commit();
            console.log('Import successful');
            return { success: true, message: 'Import successful' };
        }
        catch (error) {
            console.error('Import failed:', error);
            // Rollback the transaction if an error occurs
            await transaction.rollback();
            return { success: false, message: 'Import failed' };
        }
    }

    /**
     * Retrieve all products from the database.
     *
     * This method fetches all products from the database using the associated produitModel.
     *
     * @returns {Promise<Object[]>} A Promise that resolves to an array of product objects.
     * @throws {Error} If there is an error while retrieving the products.
     */
    async getAllProducts() {
        try {
            // Retrieve all products from the database
            const products = await this.produitModel.findAll();
            return products.map( (product) => product.toJSON() );
        } catch (error) {
            console.error('Error retrieving products:', error);
            throw new Error('Failed to retrieve products');
        }
    }
}

module.exports = {
    ProductService: new ProductService( Database, ProduitModel)
};