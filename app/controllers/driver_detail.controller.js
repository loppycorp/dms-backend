const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const defaultModel = require('../models/driver_detail.model');
const usersAuth = require('../models/user.model');
const utilities = require('../helpers/utilities.helper');
const { createSchema, updateSchema } = require('../helpers/validations/driver_detail.schema');
const db = require('../../config/mysql.db');
const STATUS_ACTIVE = 'ACTIVE';


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
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        body.created_by = userAuth.username;
        body.updated_by = userAuth.username;

        const driverDetail = await defaultModel.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.create'),
            data: driverDetail
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

        const driverDetail = await defaultModel.find(params.id);

        if (!driverDetail) {
            res.status(400).send({
                status: 'error',
                message: lang.t('driver.err.read')
            });
        }

        const updatedProfitCenter = await defaultModel.update(driverDetail.id, body)

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

        const driverDetail = await defaultModel.find(params.id);

        if (!driverDetail) {
            res.status(400).send({
                status: 'error',
                message: lang.t('driver.err.read')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('driver.suc.read'),
            data: driverDetail
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

exports.search = async (req, res) => {
    try {
        logger.info(req.path);

        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const data = await defaultModel.findAll(query);

        const totalResult = await db.query(`
        SELECT COUNT(*) as total FROM driver_details WHERE status = '${STATUS_ACTIVE}'`);

        const total = totalResult[0].total || 0;


        return res.status(200).send({
            status: 'success',
            message: lang.t('department.suc.search'),
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

        const driverDetail = await defaultModel.find(params.id);

        if (!driverDetail) {
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

        const deletedProfitCenter = await defaultModel.delete(driverDetail.id)

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