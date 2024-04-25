const request = require('supertest');
const app = require('../../../server');

// Import other required modules and dependencies
const { importProducts } = require('./import.controller.js');

// Import the Product model or any other dependencies needed for the importController
//const Produit = require("../../../database/models/Produit.model");


describe('Import Controller', () => {
  test('should import products from Excel file', async () => {

    // Mock any required dependencies or data
    /* jest.mock('./import.controller', () => ({
        importProducts:  jest.fn(() => Promise.resolve()),
    })); */

    // Perform the test request using Supertest
    const res = await request(app)
      .post('/import') // Assuming the import route is defined as a POST route '/import'
      //.attach('file', '../testProduct.xlsx'); // Attach the example Excel file for testing

    // Perform assertions on the response or database state
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Products imported successfully');

    // Optionally, perform assertions on the database state using mocks or direct queries
    //expect(saveProductToDatabase).toHaveBeenCalledTimes(2); // Assuming there are 2 products in the Excel file
    // You can also query the database using the Product model and make assertions on the imported products

    // Clean up any mocked data or restore dependencies if necessary
    //jest.restoreAllMocks();
    app.close();
  });
});
