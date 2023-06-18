const Joi = require('joi');
const defaultModel = require('../../models/driver_detail.model');

const DEFAULT_MAX_CHAR = 128;

const defaultSchema = Joi.object({
    name: Joi.string().trim().max(DEFAULT_MAX_CHAR).required()
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema,
};