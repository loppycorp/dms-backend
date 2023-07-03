const db = require('../../config/mysql.db');
const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const defaultModel = require('../models/trip.model');
const usersAuth = require('../models/user.model');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/trip.schema');

const STATUS_ACTIVE = 'ACTIVE';

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
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }
        body.requested_by = `${userAuth.first_name} ${userAuth.last_name}`;
        body.department = userAuth.department;
        body.email = userAuth.email;
        body.local_number = userAuth.local_number;
        body.contact_number = userAuth.contact_number;
        body.created_by = userAuth.username;
        body.updated_by = userAuth.username;
        body.department_id = userAuth.department_id;

        const trips = await defaultModel.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('trip.suc.create'),
            data: trips
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
        const userAuth = await usersAuth.find(auth._id);
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
        const auth = req.auth;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const data = await defaultModel.findAll(userAuth, query);

        const totalResult = await db.query(`
        SELECT COUNT(*) as total FROM trips WHERE status = '${STATUS_ACTIVE}'`);
        console.log(totalResult)

        const totalPending = await db.query(`
        SELECT COUNT(*) as total FROM trips WHERE status = '${STATUS_ACTIVE}' AND ticket_status = '${defaultModel.TICKET_STATUS_PENDING}'`);

        const totalOngoing = await db.query(`
        SELECT COUNT(*) as total FROM trips WHERE status = '${STATUS_ACTIVE}' AND ticket_status = '${defaultModel.TICKET_STATUS_ONGOING}'`);

        const totalComplete = await db.query(`
        SELECT COUNT(*) as total FROM trips WHERE status = '${STATUS_ACTIVE}' AND  ticket_status = '${defaultModel.TICKET_STATUS_COMPLETE}'`);

        const total = totalResult[0].total || 0;
        const total1 = totalPending[0].total || 0;
        const total2 = totalOngoing[0].total || 0;
        const total3 = totalComplete[0].total || 0;





        return res.status(200).send({
            status: 'success',
            message: lang.t('trip.suc.search'),
            data: data,
            pagination: {
                page_num: pageNum,
                page_limit: pageLimit,
                page_count: data ? data.length : 0,
                sort_order: sortOrder,
                sort_by: sortBy,
                total_result: total,
                stats: {
                    pending: total1,
                    ongoing: total2,
                    complete: total3
                }
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

exports.approved = async (req, res) => {
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

        const defaultVariable = await defaultModel.find(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('err.not_exists')
            });
        }

        const auth = req.auth;
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const data = await defaultModel.headApproval(defaultVariable._id, userAuth);

        if (!data) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('This ticket is for Head Department only or ticket is already ongoing'),
            });
        }
        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: data
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

exports.adminApproved = async (req, res) => {
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

        const defaultVariable = await defaultModel.find(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('err.not_exists')
            });
        }

        const auth = req.auth;
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }


        const data = await defaultModel.adminApproval(defaultVariable._id, userAuth, body);
        console.log(data)

        if (!data) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Admin Approval Only'),
            });
        }
        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: data
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

        const defaultVariable = await defaultModel.find(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('trip.err.not_exists')
            });
        }

        const auth = req.auth;
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedUser = await defaultModel.delete(defaultVariable._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('trip.suc.delete'),
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

exports.complete = async (req, res) => {
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

        const defaultVariable = await defaultModel.find(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('trip.err.not_exists')
            });
        }

        const auth = req.auth;
        const userAuth = await usersAuth.find(auth._id);
        if (!userAuth) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }
        const trip = await defaultModel.complete(defaultVariable._id, defaultVariable, userAuth);
        console.log(trip)
        if (!trip) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Permission Denied'),
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('trip.complete'),
            data: trip
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


