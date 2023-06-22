const db = require('../../config/mysql.db');
const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const defaultModel = require('../models/user.model');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema, authSchema } = require('../helpers/validations/user.schema');
const jwt = require('jsonwebtoken');

const STATUS_ACTIVE = 'ACTIVE';


exports.authenticate = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validationBody = authSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });

        }

        const validatedUser = await defaultModel.validateCreds(body.username, body.password);
        if (!validatedUser) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('user.err.invalid_pass_user')
            });

        }

        const jwtPayload = {
            _id: validatedUser._id,
            username: validatedUser.username,
            first_name: validatedUser.first_name,
            last_name: validatedUser.last_name,
            email: validatedUser.email
        };

        const jwtToken = jwt.sign(jwtPayload, process.env.JWT_KEY, { expiresIn: process.env.TOKEN_EXPIRY });

        const storeToken = await defaultModel.storeToken(validatedUser._id, jwtToken);
        if (!storeToken) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('user.err.failed_to_store_token')
            });

        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.auth'),
            token: jwtToken,
            data: jwtPayload
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validationBody = createSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });

        }

        const auth = req.auth;
        const userAuth = await defaultModel.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        body.created_by = userAuth.username;
        body.updated_by = userAuth.username;


        const user = await defaultModel.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.create'),
            data: user
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.update = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;
        const params = req.params;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
        }

        const user = await defaultModel.find(params.id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const validationBody = updateSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });

        }

        const auth = req.auth;
        const userAuth = await defaultModel.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }
        body.updated_by = userAuth.username;

        const updateUser = await defaultModel.update(user._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.update'),
            data: updateUser
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.read = async (req, res) => {
    try {
        logger.info(req.path);

        const params = req.params;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const user = await defaultModel.find(params.id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.read'),
            data: user
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.search = async (req, res) => {
    try {
        logger.info(req.path);

        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const data = await defaultModel.findAll(query);

        const totalResult = await db.query(`
        SELECT COUNT(*) as total FROM users WHERE status = '${STATUS_ACTIVE}'`);

        const total = totalResult[0].total || 0;


        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.search'),
            data: data,
            pagination: {
                page_num: pageNum,
                page_limit: pageLimit,
                page_count: data ? data.length : 0,
                sort_order: sortOrder,
                sort_by: sortBy,
                total_result: total
            }
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.delete = async (req, res) => {
    try {
        logger.info(req.path);

        const params = req.params;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });

        }

        const user = await defaultModel.find(params.id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const auth = req.auth;
        const userAuth = await defaultModel.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedUser = await defaultModel.delete(user._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: deletedUser
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.profile = async (req, res) => {
    try {
        logger.info(req.path);

        const auth = req.auth;

        const user = await defaultModel.find(auth._id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.profile'),
            data: user
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.logout = async (req, res) => {
    try {
        logger.info(req.path);

        const auth = req.auth;

        const user = await defaultModel.find(auth._id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const destroyedToken = await defaultModel.destroyToken(auth._id);
        if (!destroyedToken) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.token_failed_destroyed')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.logout'),
            data: user
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};