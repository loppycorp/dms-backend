const Joi = require('joi');
const defaultModel = require('../../models/trip.model');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    company: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).valid(
        defaultModel.COMPANY_TYPE_L,
        defaultModel.COMPANY_TYPE_V
    ),
    cost_center: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    date_of_trip_to: Joi.date(),
    date_of_trip_from: Joi.date(),
    passenger_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).valid(
        defaultModel.PASSENGER_TYPE_AUD,
        defaultModel.PASSENGER_TYPE_GUE,
        defaultModel.PASSENGER_TYPE_INS,
        defaultModel.PASSENGER_TYPE_OTH,
        defaultModel.PASSENGER_TYPE_VIP
    ),
    total_of_passengers: Joi.number().required(),
    destination: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    contact_person: Joi.number().required(),
    purpose_of_trip: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    pick_up_time: Joi.string().regex(/^([01]?\d|2[0-3]) (AM|PM)$/).required(),
    pick_up_location: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    estimate_time_of_return: Joi.string().regex(/^([01]?\d|2[0-3]) (AM|PM)$/).required(),
    trip_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    priority: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).valid(
        defaultModel.PRIORITY_HIGH,
        defaultModel.PRIORITY_STD,
        defaultModel.PRIORITY_URG
    ),
    driver: Joi.number().required(),
    vehicle: Joi.number().required(),
    remarks: Joi.string().max(LIMIT_DEFAULT_CHAR).allow(""),
    errands: Joi.string().max(LIMIT_DEFAULT_CHAR).allow(""),

});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};