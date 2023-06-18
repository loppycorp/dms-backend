const db = require('../../config/mysql.db');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';


exports.create = async (data) => {
    const attributes = {
        name: data.name,
        status: STATUS_ACTIVE,
        date_created: new Date(),
        date_updated: new Date(),
        created_by: data.created_by,
        updated_by: data.updated_by
    };

    const validation = await db.query(`SELECT * FROM departments WHERE name = '${data.name}' AND status = '${STATUS_ACTIVE}'`);
    if (validation.length > 0) {
        throw new Error(`${data.name} is already exists`);
    }

    const queryResult = await db.query('INSERT INTO departments SET ?', attributes);

    const result = queryResult[0] || queryResult;

    const affected = result.affectedRows;
    if (affected === 1) return { id: result.insertId, ...attributes };

    throw new Error('Error on creating driver record!');
}

exports.find = async (id) => {
    const queryResult = await db.query(`SELECT * FROM departments WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);

    return queryResult[0] ? queryResult[0] : null;
};

exports.findAll = async (id) => {
    const queryResults = await db.query(`SELECT name, DATE_FORMAT(date_created, '%Y-%m-%d') as date_created, DATE_FORMAT(date_updated, '%Y-%m-%d') as date_updated, created_by FROM departments WHERE status = '${STATUS_ACTIVE}'`);

    return queryResults ? queryResults : [];
};

exports.update = async (id, data) => {
    const attributes = {
        name: data.name,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE departments SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM departments WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);
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

    const update = await db.query(`UPDATE departments SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM departments WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating driver status record!');
}

exports.delete = async (id) => {
    const attributes = { status: STATUS_INACTIVE };

    const update = await db.query(`UPDATE departments SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM departments WHERE _id = ${id} AND status = '${STATUS_INACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting department record!');
}


exports.STATUS_ACTIVE = STATUS_ACTIVE;
exports.STATUS_INACTIVE = STATUS_INACTIVE;
exports.STATUS_DELETED = STATUS_DELETED;