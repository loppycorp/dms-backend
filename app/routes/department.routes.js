require('dotenv').config();
const defaultController = require('../controllers/department.controller');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/departments', defaultController.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/departments', defaultController.getAll);

    // View profit-center record
    app.get(process.env.BASE_URL + '/departments/:id', defaultController.get);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/departments/:id', defaultController.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/departments/:id', defaultController.delete);
};