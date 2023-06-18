const mysql = require('mysql2/promise');
const { logger } = require('../app/middlewares/logging.middleware');

require('dotenv').config();

const options = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0,
};


const pool = mysql.createPool(options);

exports.pool = pool;
exports.query = async (query, attributes) => {
    try {
        const queryResult = await pool.query(query, attributes);
        const [row] = queryResult;

        if (!row) {
            throw new Error('database query error');
        }

        return row;
    } catch (error) {
        const err = {
            message: error.message,
            method: 'query',
            params: JSON.stringify(options),
            status: 'ERROR',
            query: query,
            attributes: attributes
        };

        logger.error(err);

        if (process.env.DEBUG == 'YES') {
            return Promise.reject(new Error(err.message));
        } else {
            return Promise.reject(new Error('Database connection error!'));
        }
    }
};