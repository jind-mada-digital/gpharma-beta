const ProductExportService = require('../services/ProductExportService');
const DateTimeUtils = require('../utils/DateTimeUtils');

const allowedExportFormats = ['xlsx'];

/**
 * Export product lists in allowed formats lists
 * 
 * It expects the request body to contain the following parameters:
 *   - dataType: The type of data to be exported ( Database table, default product )
 *   - exportFormat: The format in which the products should be exported.
 *
 * @route POST /modules/product-import-export/export
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {void}
 */
exports.exportProducts = async (req, res) => {
    try {

        const {dataType, exportFormat} = req.body;

        // Validate the received values
        if ( !allowedExportFormats.includes(exportFormat) ) {
            return res.status(400).json({ message: 'Invalid dataType or exportFormat' });
        }

        const excelBuffer = await ProductExportService.exportProducts();
        const currentTimestamp = DateTimeUtils.getCurrentTimestamp();
        const filename = `gpharma-export-${currentTimestamp}.xlsx`;

        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error exporting products', error: error.message });
    }
};