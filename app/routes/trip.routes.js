require('dotenv').config();
const defaultController = require('../controllers/trip.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');



module.exports = (app) => {
    app.post(process.env.BASE_URL + '/trips', auth.validateToken, defaultController.create);

    app.get(process.env.BASE_URL + '/trips', auth.validateToken, pagination.setAttributes, defaultController.search);

    app.get(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.read);

    app.put(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.update);

    app.delete(process.env.BASE_URL + '/trips/:id', auth.validateToken, defaultController.delete);

    app.put(process.env.BASE_URL + '/trips/:id/head', auth.validateToken, defaultController.approved);

    app.put(process.env.BASE_URL + '/trips/:id/admin', auth.validateToken, defaultController.adminApproved);

    app.put(process.env.BASE_URL + '/trips/:id/complete', auth.validateToken, defaultController.complete);


};