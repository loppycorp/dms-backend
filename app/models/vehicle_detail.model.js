const db = require('../../config/mysql.db');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const VEHICLE_STATUS_AVAILABLE = 'AVAILABLE';
const VEHICLE_STATUS_UNAVAILABLE = 'UNAVAILABLE';
const VEHICLE_STATUS_MAINTENANCE = 'UNDER MAINTENANCE';



exports.create = async (data) => {
    const attributes = {
        plate_number: data.employee_number,
        model: data.model,
        year_model: data.year_model,
        vehicle_status: VEHICLE_STATUS_AVAILABLE,
        status: STATUS_ACTIVE,
        date_created: new Date(),
        date_updated: new Date(),
        created_by: data.created_by,
        updated_by: data.updated_by
    };

    const queryResult = await db.query('INSERT INTO vehicle_details SET ?', attributes);

    const result = queryResult[0] || queryResult;

    const affected = result.affectedRows;
    if (affected === 1) return { id: result.insertId, ...attributes };

    throw new Error('Error on creating vehicle record!');
}

exports.find = async (id) => {
    const queryResult = await db.query(`SELECT * FROM vehicle_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);

    return queryResult[0] ? queryResult[0] : null;
};

exports.findAll = async (id) => {
    const queryResults = await db.query(`SELECT * FROM vehicle_details WHERE status = '${STATUS_ACTIVE}'`);

    return queryResults ? queryResults : [];
};

exports.update = async (id, data) => {
    const attributes = {
        plate_number: data.employee_number,
        model: data.model,
        year_model: data.year_model,
        vehicle_status: data.vehicle_status,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE vehicle_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM vehicle_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating vehicle record!');
}

exports.updateStatus = async (id, data) => {
    const attributes = {
        vehicle_status: data.vehicle_status,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE vehicle_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM vehicle_details WHERE id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating vehicle status record!');
}

exports.delete = async (id) => {
    const attributes = { status: STATUS_INACTIVE };

    const update = await db.query(`UPDATE vehicle_details SET ? WHERE id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM vehicle_details WHERE id = ${id} AND status = '${STATUS_INACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting vehicle record!');
}


exports.STATUS_ACTIVE = STATUS_ACTIVE;
exports.STATUS_INACTIVE = STATUS_INACTIVE;
exports.STATUS_DELETED = STATUS_DELETED;

exports.VEHICLE_STATUS_AVAILABLE = VEHICLE_STATUS_AVAILABLE;
exports.VEHICLE_STATUS_UNAVAILABLE = VEHICLE_STATUS_UNAVAILABLE;
exports.VEHICLE_STATUS_MAINTENANCE = VEHICLE_STATUS_MAINTENANCE;

