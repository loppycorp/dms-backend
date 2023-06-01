const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const defaultModel = require('../models/vehicle_detail.model');
const utilities = require('../helpers/utilities.helper');
const { createSchema, updateSchema } = require('../helpers/validations/vehicle_detail.schema');

exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validation = createSchema.validate(body, { abortEarly: false });
        if (validation.error) {
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validation.error.details
            });
            return false;
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

        const defaultVariable = await defaultModel.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.create'),
            data: defaultVariable
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
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

        const validation = updateSchema.validate(body, { abortEarly: false });
        if (validation.error) {
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validation.error.details
            });
            return false;
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

        const defaultVariable = await defaultModel.find(params.id);

        if (!defaultVariable) {
            res.status(400).send({
                status: 'error',
                message: lang.t('driver.err.read')
            });
        }

        const updatedProfitCenter = await defaultModel.update(defaultVariable.id, body)

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.update'),
            data: updatedProfitCenter

        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.get = async (req, res) => {
    try {
        logger.info(req.path);

        const params = req.params;

        const defaultVariable = await defaultModel.find(params.id);

        if (!defaultVariable) {
            res.status(400).send({
                status: 'error',
                message: lang.t('driver.err.read')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.read'),
            data: defaultVariable
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        logger.info(req.path);

        const query = req.query;

        const profitCenters = await defaultModel.findAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.search'),
            data: profitCenters
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.delete = async (req, res) => {
    try {
        logger.info(req.path);

        const params = req.params;

        const defaultVariable = await defaultModel.find(params.id);

        if (!defaultVariable) {
            res.status(400).send({
                status: 'error',
                message: lang.t('driver.err.read')
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

        const deletedProfitCenter = await defaultModel.delete(defaultVariable.id)

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.delete'),
            data: deletedProfitCenter
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};