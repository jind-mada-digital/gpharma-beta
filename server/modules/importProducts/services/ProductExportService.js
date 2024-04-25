const { ProductService } = require('../services/Product.service');
const ExcelUtils = require('../utils/ExcelUtils');


class ProductExportService {

    /**
     * Export products as an Excel buffer.
     *
     * This static method in the ProductExportService class handles the exporting of products.
     * It fetches all products using the ProductService.getAllProducts() method, converts them to an Excel workbook,
     * and then writes the workbook to a buffer for exporting.
     *
     * @returns {Promise<Buffer>} A Promise that resolves to an Excel buffer containing the exported products.
     * @throws {Error} If there is an error while exporting the products.
     */
    static async exportProducts() {
        try{
            const products = await ProductService.getAllProducts();
            const workbook = ExcelUtils.convertToWorkbook(products);
            const excelBuffer = ExcelUtils.writeWorkbookToBuffer(workbook);
            return excelBuffer;
        }catch (error){
            console.error('Error exporting products:', error);
            throw new Error('Failed to export products');
        }
    }
}

module.exports = ProductExportService;