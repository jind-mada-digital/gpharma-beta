const {VenteService} = require('../services/venteService');

/**
 * Get lists of Vente made
 * 
 * It expects the request body to contain the following parameters:
 *   - dataType: The type of data to be exported ( Database table, default product )
 *   - exportFormat: The format in which the products should be exported.
 *
 * @route POST /modules/default/ventes
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {void}
 */
exports.lists = async (req, res) => {
    const venteList = await VenteService.getAllVente();
    return res.send( venteList );
};

exports.bestSeller = async (req, res) => {
    const venteList = await VenteService.getBestSeller();
    return res.send( venteList );
};