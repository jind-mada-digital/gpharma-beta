const XLSX = require('xlsx');

exports.parseExcelData = (data) => {
    // Implement the logic to parse the Excel data
    // This function should extract the necessary product information from the provided data and return an array of products
    // You can use libraries like 'xlsx' or 'exceljs' to parse Excel files
  
    // Example implementation using 'xlsx' library
    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    return jsonData.map((row) => ({
        code_lot_produit: row.code_lot_produit,
        nom_produit: row.nom_produit,
        classification_produit: row.classification_produit,
        description: row.description,
        prix_stock: row.prix_stock,
        presentation_quantite: row.presentation_quantite,
        quantite_stock: row.quantite_stock,
        stock_min: row.stock_min,
        stock_max: row.stock_max,
        date_peremption: row.date_peremption,
        fabricant_id: row.fabricant_id,
        forme_id: row.forme_id,
        famille_id: row.famille_id,
        unite_presentation: row.unite_presentation,
        unite_achat: row.unite_achat,
        unite_vente: row.unite_vente,
        unite_stock: row.unite_stock  
    }));
};

exports.validateProductData = (product) => {
    // Implement the logic to validate the product data
    // This function should perform any necessary validation checks on the provided product object
    // Return true if the product data is valid, or false otherwise
    // You can include validations such as checking for required fields, data types, or any specific business rules
  
    // Example validation (assumes all fields are required)
    return (
        product.code_lot_produit &&
        product.nom_produit &&
        product.description &&
        product.prix_stock &&
        product.presentation_quantite &&
        product.quantite_stock &&
        product.stock_min &&
        product.stock_max &&
        product.date_peremption &&
        product.fabricant_id &&
        product.forme_id &&
        product.famille_id &&
        product.unite_presentation &&
        product.unite_achat &&
        product.unite_vente &&
        product.unite_stock    
    );
};