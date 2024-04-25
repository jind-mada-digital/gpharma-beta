const expect = require("chai").expect;
const {ProductService}= require("./Product.service");

describe("ProductService", () => {
  it("should be able to import products into the database", async () => {
    const productService = ProductService;

    const validProducts = [
        {
            code_lot_produit: "1234567890",
            nom_produit: "Produit 1",
            classification_produit: "Catégorie 1",
            description: "Description du produit 1",
            image: "image.jpg",
            presentation_quantite: 10,
            quantite_stock: 100,
            prix_stock: 100,
            stock_min: 50,
            stock_max: 150,
            date_der_ravitaillement: new Date(),
            date_peremption: new Date(),
        },
        {
            code_lot_produit: "2345678901",
            nom_produit: "Produit 2",
            classification_produit: "Catégorie 2",
            description: "Description du produit 2",
            image: "image.jpg",
            presentation_quantite: 20,
            quantite_stock: 200,
            prix_stock: 200,
            stock_min: 100,
            stock_max: 250,
            date_der_ravitaillement: new Date(),
            date_peremption: new Date(),
        },
    ];

    const result = await productService.importProducts(validProducts);

    expect(result.success).to.equal(true);
    expect(result.message).to.equal('Import successful');
  });
});