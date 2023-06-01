const Joi = require('joi');
const defaultModel = require('../../models/vehicle_detail.model');

const DEFAULT_MAX_CHAR = 128;

const defaultSchema = Joi.object({
    plate_number: Joi.string().trim().max(DEFAULT_MAX_CHAR).required(),
    model: Joi.string().trim().max(DEFAULT_MAX_CHAR).required(),
    year_model: Joi.number().required(),
    vehicle_status: Joi.string().trim().valid(
        defaultModel.VEHICLE_STATUS_AVAILABLE,
        defaultModel.VEHICLE_STATUS_UNAVAILABLE,
        defaultModel.VEHICLE_STATUS_MAINTENANCE
    ),
    created_by: Joi.string().trim().max(DEFAULT_MAX_CHAR).required(),
    updated_by: Joi.string().trim().max(DEFAULT_MAX_CHAR).required()

});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema,
    statusSchema: defaultSchema.driver_status
};