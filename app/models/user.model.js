const db = require('../../config/mysql.db');
const bcrypt = require('bcrypt');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const USER_ROLE_ADMIN = 'ADMIN';
const USER_ROLE_HEAD = 'HEAD DEPARTMENT';
const USER_ROLE_USER = 'USER';



exports.create = async (data) => {
    const attributes = {
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.first_name + " " + data.last_name,
        email: data.email,
        local_number: data.local_number,
        contact_number: data.contact_number,
        username: data.username,
        hash_password: bcrypt.hashSync(data.password, 10),
        token: data.token,
        role: data.role,
        department: data.department,
        status: STATUS_ACTIVE,
        date_created: new Date(),
        date_updated: new Date(),
        created_by: data.created_by,
        updated_by: data.updated_by
    };

    const queryResult = await db.query('INSERT INTO users SET ?', attributes);

    const result = queryResult[0] || queryResult;

    const affected = result.affectedRows;
    if (affected === 1) return { id: result.insertId, ...attributes };

    throw new Error('Error on creating driver record!');
}

// exports.validateCreds = async (data) => {
//     const queryResult = await db.query(
//         `SELECT * FROM users WHERE username = '${data}' AND status = '${STATUS_ACTIVE}'`
//     );

//     console.log(queryResult)
//     const user = queryResult[0] || null;
//     if (!user) return false;

//     const pass = await bcrypt.compare(data.password, user.hash_password);
//     if (!pass) return false;

//     return user;
// };

exports.validateCreds = async (username, password) => {
    const queryResult = await db.query(
        `SELECT * FROM users WHERE username = ? AND status = ?`,
        [username, STATUS_ACTIVE]
    );


    const user = queryResult[0] || null;
    if (!user) return false;

    const pass = await bcrypt.compare(password, user.hash_password);
    if (!pass) return false;

    return user;
};

exports.find = async (id) => {
    const queryResult = await db.query(
        `SELECT a._id, a.first_name, a.last_name, a.full_name as name, a.username, a.email, b.name as department, a.role FROM users AS a JOIN departments AS b ON b._id = a.department WHERE a._id = ${id} AND a.status = '${STATUS_ACTIVE}'`);

    return queryResult[0] ? queryResult[0] : null;
};

// exports.findAll = async (id) => {
//     const queryResults = await db.query(`SELECT * FROM users WHERE status = '${STATUS_ACTIVE}'`);

//     return queryResults ? queryResults : [];
// };

exports.findAll = async () => {
    const queryResults = await db.query(
        `SELECT a._id, a.first_name, a.last_name, a.full_name as name, a.username, a.email, a.local_number, a.contact_number, b.name as department, a.role, a.status, DATE_FORMAT(a.date_created, '%Y-%m-%d') as date_created, DATE_FORMAT(a.date_updated, '%Y-%m-%d') as date_updated FROM users AS a JOIN departments AS b ON b._id = a.department WHERE a.status = '${STATUS_ACTIVE}'`
    );

    return queryResults || [];
};


exports.validateToken = async (id, token) => {
    const queryResult = await db.query(
        `SELECT * FROM users WHERE _id = ? AND token = ?`,
        [id, token]
    );

    const user = queryResult[0] || null;
    return user;
};

exports.update = async (id, data) => {
    const attributes = {
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.first_name + " " + data.last_name,
        email: data.email,
        username: data.username,
        hash_password: bcrypt.hashSync(data.password, 10),
        role: data.role,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE users SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM users WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating user record!');
}

exports.storeToken = async (id, token) => {
    const updateQuery = `UPDATE users SET token = ? WHERE _id = ?`;
    const updateParams = [token, id];

    const updateResult = await db.query(updateQuery, updateParams);

    if (updateResult.affectedRows === 0) return false;

    return updateResult;
};


exports.delete = async (id) => {
    const attributes = { status: STATUS_INACTIVE };

    const update = await db.query(`UPDATE users SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM users WHERE _id = ${id} AND status = '${STATUS_INACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting driver record!');
}


exports.STATUS_ACTIVE = STATUS_ACTIVE;
exports.STATUS_INACTIVE = STATUS_INACTIVE;
exports.STATUS_DELETED = STATUS_DELETED;

module.exports.USER_ROLE_ADMIN = USER_ROLE_ADMIN;
module.exports.USER_ROLE_USER = USER_ROLE_USER;
module.exports.USER_ROLE_HEAD = USER_ROLE_HEAD;

// db
// CREATE TABLE dms.users (
//     _id INT AUTO_INCREMENT PRIMARY KEY,
//     first_name VARCHAR(255),
//     last_name VARCHAR(255),
//     full_name VARCHAR(255),
//     email VARCHAR(255),
//     local_number VARCHAR(20),
//     contact_number VARCHAR(20),
//     role VARCHAR(255),
//     department INT,
//     username VARCHAR(255),
//     hash_password VARCHAR(255),
//     token VARCHAR(255),
//     status VARCHAR(20),
//     date_created DATETIME,
//     date_updated DATETIME,
//     created_by VARCHAR(255),
//     updated_by VARCHAR(255)
// );
