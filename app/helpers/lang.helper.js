const i18next = require('i18next');

i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: {
            translation: {
                global: {
                    err: {
                        validation_failed: 'Validation failed!',
                        an_error_occured: 'An error occured while processing the request!'
                    }
                },
                profit_center: {
                    suc: {
                        create: 'Successfully created profit-center record!',
                        read: 'Successfully fetched profit-center record!',
                        update: 'Successfully updated profit-center record!',
                        delete: 'Successfully deleted profit-center record!',
                        search: 'Successfully fetched profit-center records!',
                    },
                    err: {
                        create: 'Failed to ceate profit-center record!',
                        read: 'Profit center record doesn\'t exists!',
                        update: 'Failed to update profit-center record!',
                        delete: 'Failed to delete profit-center record!',
                        search: 'No records found!',
                    }
                }
            }
        }
    }
});

module.exports = i18next;