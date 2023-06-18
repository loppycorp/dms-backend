require('dotenv').config();
const defaultController = require('../controllers/trip.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');



module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/trips', auth.validateToken, defaultController.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/trips', auth.validateToken, pagination.setAttributes, defaultController.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.delete);
};