const Joi = require('joi');

const paramsSchema = Joi.object({
    id: Joi.number(),
});

module.exports = {
    paramsSchema,
    validateParamsSchema: paramsSchema
};