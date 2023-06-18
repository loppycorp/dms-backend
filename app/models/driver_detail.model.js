const db = require('../../config/mysql.db');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const DRIVER_STATUS_AVAILABLE = 'AVAILABLE';
const DRIVER_STATUS_UNAVAILABLE = 'UNAVAILABLE';


exports.create = async (data) => {
    const attributes = {
        employee_number: data.employee_number,
        name: data.name,
        contact_number: data.contact_number,
        driver_status: DRIVER_STATUS_AVAILABLE,
        status: STATUS_ACTIVE,
        date_created: new Date(),
        date_updated: new Date(),
        created_by: data.created_by,
        updated_by: data.updated_by
    };

    const queryResult = await db.query('INSERT INTO driver_details SET ?', attributes);

    const result = queryResult[0] || queryResult;

    const affected = result.affectedRows;
    if (affected === 1) return { id: result.insertId, ...attributes };

    throw new Error('Error on creating driver record!');
}

exports.find = async (id) => {
    const queryResult = await db.query(`SELECT * FROM driver_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);

    return queryResult[0] ? queryResult[0] : null;
};

exports.findAll = async (id) => {
    const queryResults = await db.query(`SELECT * FROM driver_details WHERE status = '${STATUS_ACTIVE}'`);

    return queryResults ? queryResults : [];
};

exports.update = async (id, data) => {
    const attributes = {
        employee_number: data.employee_number,
        name: data.name,
        contact_number: data.contact_number,
        driver_status: data.driver_status,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE driver_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM driver_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating driver record!');
}

exports.updateStatus = async (id, data) => {
    const attributes = {
        driver_status: data.driver_status,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE driver_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM driver_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating driver status record!');
}

exports.delete = async (id) => {
    const attributes = { status: STATUS_INACTIVE };

    const update = await db.query(`UPDATE driver_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM driver_details WHERE id = ${id} AND status = '${STATUS_INACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting driver record!');
}


exports.STATUS_ACTIVE = STATUS_ACTIVE;
exports.STATUS_INACTIVE = STATUS_INACTIVE;
exports.STATUS_DELETED = STATUS_DELETED;

exports.DRIVER_STATUS_AVAILABLE = DRIVER_STATUS_AVAILABLE;
exports.DRIVER_STATUS_UNAVAILABLE = DRIVER_STATUS_UNAVAILABLE;

// DB
// CREATE TABLE dms.driver_details (
// 	_id INT AUTO_INCREMENT PRIMARY KEY,
//     employee_number VARCHAR(255),
//     name VARCHAR(255),
//     contact_number VARCHAR(20),
//     driver_status VARCHAR(20),
//     status VARCHAR(20),
//     date_created DATETIME,
//     date_updated DATETIME,
//     created_by VARCHAR(255),
//     updated_by VARCHAR(255)
// );