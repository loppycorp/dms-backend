require('dotenv').config();
const defaultController = require('../controllers/vehicle_detail.controller');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/vehicle-details', defaultController.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/vehicle-details', defaultController.getAll);

    // View profit-center record
    app.get(process.env.BASE_URL + '/vehicle-details/:id', defaultController.get);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/vehicle-details/:id', defaultController.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/vehicle-details/:id', defaultController.delete);
};