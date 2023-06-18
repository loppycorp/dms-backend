const Joi = require('joi');
const defaultModel = require('../../models/driver_detail.model');

const DEFAULT_MAX_CHAR = 128;

const defaultSchema = Joi.object({
    employee_number: Joi.string().trim().max(DEFAULT_MAX_CHAR).required(),
    name: Joi.string().trim().max(DEFAULT_MAX_CHAR).required(),
    contact_number: Joi.number().required(),
    driver_status: Joi.string().trim().valid(
        defaultModel.DRIVER_STATUS_AVAILABLE,
        defaultModel.DRIVER_STATUS_UNAVAILABLE
    )

});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema,
    statusSchema: defaultSchema.driver_status
};