const { logger } = require('../middlewares/logging.middleware')
const lang = require('../helpers/lang.helper');
const jwt = require('jsonwebtoken');
const userService = require('../models/user.model');

exports.validateToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).send({
            'status': 'error',
            'message': lang.t('auth.err.token_not_exists')
        });
    }

    const bearer = bearerHeader.split(' ');
    let bearerToken = bearerHeader;

    if (bearer.length > 1)
        bearerToken = bearer[1];

    try {
        const jwtPayload = jwt.verify(bearerToken, process.env.JWT_KEY);
        if (!jwtPayload) {
            return res.status(403).send({
                'status': 'error',
                'message': lang.t('auth.err.failed_verify')
            });
        }

        const validateToken = await userService.validateToken(jwtPayload._id, bearerToken);
        if (!validateToken) {
            return res.status(403).send({
                'status': 'error',
                'message': lang.t('auth.err.invalid_token')
            });
        }

        req.auth = jwtPayload;
        next();
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(403).send({
            'status': 'error',
            'message': `Auth Error: ${err.message}`
        });
    }
};