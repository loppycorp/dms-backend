const lang = require('../helpers/lang.helper');

exports.getMessage = (err) => {
    if (err.message)
        return err.message;

    return lang.t('global.err.an_error_occured');
};