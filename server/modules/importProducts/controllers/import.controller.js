//const XLSX = require('xlsx');
/* const Database = require('../../../config/Database.js');
const ProduitModel = require("../../../database/models/Produit.model.js"); */

const {ProductService} = require('../services/Product.service');
const parseExcelUtil = require('../utils/parseExcel.util.js');


const handleFile = async (excelFile) => {
  const parsedProducts = parseExcelUtil.parseExcelData(excelFile.data);
  console.log('parsedProducts:' + parsedProducts.length);
  const validProducts = parsedProducts.filter(parseExcelUtil.validateProductData);
  console.log('validProducts:' + validProducts.length);
  return validProducts;
}


exports.importProducts = async (req, res) => {
  try {
    if (!req.files || !req.files.import ) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const excelFile = req.files.import;
    const parsedProducts = parseExcelUtil.parseExcelData(excelFile.data);
    
    //const validProducts = await handleFile(excelFile);
    const validProducts = parsedProducts.filter(parseExcelUtil.validateProductData);

    // Save validProducts to the database
    const result = await ProductService.importProducts(validProducts);
    
    return res.status(200).json( result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error importing products', error: error.message });
  }
}



/* exports.importProducts = async (req, res) => {

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const excelFile = req.files.file;

    try {
        const parsedProducts = parseExcelUtil.parseExcelData( excelFile.data );
        const validProducts = parsedProducts.filter( parseExcelUtil.validateProductData );

        // Process each row of data and save it to the database
        const transaction = await Database.transaction();

        for (const product of validProducts) {
            await ProduitModel.create(product, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({ message: 'Products imported successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error importing products', error: error.message });
    }
}; */

/* exports.importProducts = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;

    // Read the Excel file
    const workbook = XLSX.read(file.data, { type: 'buffer' });

    // Assuming the first sheet is where the data is located
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Process each row of data and save it to the database
    const transaction = await Database.transaction();

    for (const data of jsonData) {
      const item = {
        code_lot_produit: data.code_lot_produit,
        nom_produit: data.nom_produit,
        classification_produit: data.classification_produit,
        description: data.description,
        // Set other properties based on your Excel file columns
        // ...
      };

      await ProduitModel.create(item, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: 'Products imported successfully' });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Error importing products' });
  }
}; */