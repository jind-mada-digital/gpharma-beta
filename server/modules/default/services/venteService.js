const Database = require('../../../config/Database.js');
const venteModel = require("../../../database/models/Vente.model.js");
const VenteDetailModel = require("../../../database/models/Vente_detail.model.js");
const ProductModel = require("../../../database/models/Produit.model.js");

class VenteService {

    constructor(database, venteModel) {
        this.database = database;
        this.venteModel = venteModel;
    }

    /**
     * Import valid ventes into the database.
     *
     * This method processes an array of valid ventes and saves them to the database using a transaction.
     *
     * @param {Object[]} validventes - An array of valid product objects to be imported.
     * @returns {Promise<Object>} A Promise that resolves to an object containing the import status:
     *                            - {success: true, message: 'Import successful'} if the import is successful.
     *                            - {success: false, message: 'Import failed'} if the import fails.
     * @throws {Error} If there is an error during the import process.
     */
    async getTest() {

        let transaction = null;

        try{
            console.log('Getting all vente made...');
            // Process each row of data and save it to the database
            transaction = await this.database.transaction();

            // TODO: Write the code to get vent lists

            await transaction.commit();
            console.log('Operation successful');
            return { success: true, message: 'Operation successful' };
        }
        catch (error) {
            console.error('Operation failed:', error);
            // Rollback the transaction if an error occurs
            await transaction.rollback();
            return { success: false, message: 'Operation failed' };
        }
    }

    /**
     * Retrieve all data vente from the database.
     *
     * This method fetches all ventes from the database using the associated venteModel.
     *
     * @returns {Promise<Object[]>} A Promise that resolves to an array of product objects.
     * @throws {Error} If there is an error while retrieving the ventes.
     */
    async getAllVente() {
        try {
            // Retrieve all ventes from the database
            const ventes = await this.venteModel.findAll({
                include: [
                    {
                        model: VenteDetailModel,
                        include: ProductModel, // Include the Product model in the VenteDetail association
                    },
                ],
            });
            return ventes.map( (item) => item.toJSON() );
        } catch (error) {
            console.error('Error retrieving vente lists:', error);
            throw new Error('Failed to retrieve provente lists');
        }
    }

    async getBestSeller() {
        try {
            // Retrieve all ventes from the database
            const ventes = await VenteDetailModel.findAll({
                include: ProductModel
            });
            const jsonData = ventes.map( (item) => item.toJSON() );
            const topSells = this.getTopSellingProducts( jsonData );
            return topSells;
        } catch (error) {
            console.error('Error retrieving vente lists:', error);
            throw new Error('Failed to retrieve provente lists');
        }
    }

    getTopSellingProducts( venteDetails ) {
        // Create a map to store the product codes and their total quantity sold
        const productQuantityMap = new Map();
      
        // Iterate through the data and calculate the total quantity sold for each product
        venteDetails.forEach((venteDetail) => {
          const productCode = venteDetail.produit_code_lot_produit;
          const quantitySold = venteDetail.quantite_vendue;
      
          // If the product code already exists in the map, add the quantity sold to it
          if (productQuantityMap.has(productCode)) {
            const currentQuantity = productQuantityMap.get(productCode);
            productQuantityMap.set(productCode, currentQuantity + quantitySold);
          } else {
            // If it doesn't exist, initialize it with the quantity sold
            productQuantityMap.set(productCode, quantitySold);
          }
        });
      
        // Sort the products by total quantity sold in descending order
        const sortedProducts = Array.from(productQuantityMap.entries()).sort(
          (a, b) => b[1] - a[1]
        );
      
        // Get the top 3 best-selling products
        //const topProducts = sortedProducts.slice(0, 5);

        let data = sortedProducts.map( ( item ) => {
            let selleDetails = venteDetails.filter( venteDetail => venteDetail.produit_code_lot_produit == item[0] )[0];
            //product.qte_vendu = item[1];
            return { produit: selleDetails.produit, qte_vendu: item[1] };
        } );
      
        return data;
    }
}

module.exports = {
    VenteService: new VenteService( Database, venteModel)
};