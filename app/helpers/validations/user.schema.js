const Joi = require('joi');
const defaultModel = require('../../models/user.model');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    first_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    last_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    email: Joi.string().email().required().max(LIMIT_DEFAULT_CHAR),
    local_number: Joi.number().required(),
    contact_number: Joi.number().required(),
    username: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    password: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    role: Joi.string().trim()
        .valid(defaultModel.USER_ROLE_ADMIN, defaultModel.USER_ROLE_USER, defaultModel.USER_ROLE_HEAD),
    department: Joi.number().required(),

    created_by: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required(),
    updated_by: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).required()

});

const authSchema = Joi.object({
    username: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    password: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR)
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema,
    authSchema
};