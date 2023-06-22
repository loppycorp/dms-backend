require('dotenv').config();
const user = require('../controllers/user.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Get user record
    app.get(process.env.BASE_URL + '/users/profile', auth.validateToken, user.profile);

    // Login user
    app.post(process.env.BASE_URL + '/users/login', user.authenticate);

    // Logout user
    app.post(process.env.BASE_URL + '/users/logout', auth.validateToken, user.logout);

    // Create new user record
    app.post(process.env.BASE_URL + '/users', auth.validateToken, user.create);

    // List available user records
    app.get(process.env.BASE_URL + '/users', auth.validateToken, pagination.setAttributes, user.search);

    // View user record
    app.get(process.env.BASE_URL + '/users/:id', auth.validateToken, user.read);

    // Edit user record
    app.put(process.env.BASE_URL + '/users/:id', auth.validateToken, user.update);

    // Delete user record
    app.delete(process.env.BASE_URL + '/users/:id', auth.validateToken, user.delete);
};