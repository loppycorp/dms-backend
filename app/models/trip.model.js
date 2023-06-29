const db = require('../../config/mysql.db');
const sendEmail = require('../../config/sendEmail');
const sendApprovedEmail = require('../../config/sendApprovedEmail');


const USER_ROLE_ADMIN = 'ADMIN';
const USER_ROLE_HEAD = 'HEAD DEPARTMENT';
const USER_ROLE_USER = 'USER';

const TICKET_TYPE = 'TRIP';

const TICKET_STATUS_PENDING = 'PENDING';
const TICKET_STATUS_APPROVED = 'APPROVED';
const TICKET_STATUS_DECLINED = 'DECLINED';
const TICKET_STATUS_ONGOING = 'ONGOING';
const TICKET_STATUS_COMPLETE = 'COMPLETED';

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const COMPANY_TYPE_L = 'L&T';
const COMPANY_TYPE_V = 'VPBO';

const PASSENGER_TYPE_VIP = 'VIP';
const PASSENGER_TYPE_GUE = 'GUEST';
const PASSENGER_TYPE_INS = 'INSPECTOR';
const PASSENGER_TYPE_AUD = 'AUDITOR';
const PASSENGER_TYPE_OTH = 'OTHERS';

const PRIORITY_HIGH = 'HIGH';
const PRIORITY_URG = 'URGENT';
const PRIORITY_STD = 'STANDARD';

const TRIP_TYPE_DO = 'DROP ONLY';
const TRIP_TYPE_DP = 'DROP AND PICK-UP';
const TRIP_TYPE_WT = 'WAITING';

const TRIP_HEAD_EMAIL = 'TRIP REQUEST: HEAD DEPARTMENT APPROVAL';
const TRIP_ADMIN_EMAIL = 'TRIP REQUEST: ADMIN APPROVAL';
const TRIP_APPROVED_EMAIL = 'TRIP REQUEST: APPROVED';



function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}



exports.create = async (data) => {
    const attributes = {
        date_of_request: new Date(),
        requested_by: data.requested_by,
        department: data.department,
        email: data.email,
        local_number: data.local_number,
        contact_number: data.contact_number,
        company: data.company,
        cost_center: data.cost_center,
        date_of_trip_to: formatDate(data.date_of_trip_to),
        date_of_trip_from: formatDate(data.date_of_trip_from),
        passenger_type: data.passenger_type,
        total_of_passengers: data.total_of_passengers,
        destination: data.destination,
        contact_person: data.contact_person,
        purpose_of_trip: data.purpose_of_trip,
        pick_up_time: data.pick_up_time,
        pick_up_location: data.pick_up_location,
        estimate_time_of_return: data.estimate_time_of_return,
        trip_type: data.trip_type,
        priority: data.priority,
        type: TICKET_TYPE,
        ticket_status: TICKET_STATUS_PENDING,
        remarks: data.remarks,
        errands: data.errands,
        status: STATUS_ACTIVE,
        date_created: new Date(),
        date_updated: new Date(),
        created_by: data.created_by,
        updated_by: data.updated_by
    };

    const queryResult = await db.query('INSERT INTO trips SET ?', attributes);

    const result = queryResult[0] || queryResult;

    const tripResult = await db.query(
        `SELECT *, DATE_FORMAT(a.date_created, '%Y-%m-%d') from trips as a 
        WHERE a._id = ${result.insertId} AND a.status = '${STATUS_ACTIVE}'`);


    const getAllHeadEmails = await db.query(
        `SELECT a.email FROM users as a WHERE a.status = '${STATUS_ACTIVE}' and a.role ='${USER_ROLE_HEAD}' and a.department = ${data.department_id} `
    );

    sendEmail(TRIP_HEAD_EMAIL, getAllHeadEmails[0].email, tripResult[0]);

    const affected = result.affectedRows;
    if (affected === 1) return { _id: result.insertId, ...attributes };

    throw new Error('Error on creating trip record!');
}

exports.find = async (id) => {
    const queryResult = await db.query(
        `SELECT * from trips as a WHERE a._id = ${id} AND a.status = '${STATUS_ACTIVE}'`);

    return queryResult[0] ? queryResult[0] : null;
};

// exports.findAll = async (id) => {
//     const queryResults = await db.query(`SELECT * FROM users WHERE status = '${STATUS_ACTIVE}'`);

//     return queryResults ? queryResults : [];
// };

exports.findAll = async (user, query) => {

    const { pageNum, sortOrder } = query.pagination;

    if (user.role == USER_ROLE_ADMIN) {
        const queryResults = await db.query(
            `SELECT *
            FROM trips AS a 
            WHERE a.status = '${STATUS_ACTIVE}'
            ORDER BY a._id ${sortOrder}
            LIMIT 10 OFFSET ${(pageNum - 1) * 10}`

        );
        return queryResults || [];
    } else if (user.role == USER_ROLE_HEAD) {
        const queryResults = await db.query(
            `SELECT * 
            from trips as a 
            WHERE a.status = '${STATUS_ACTIVE}' and department = '${user.department}'
            ORDER BY a._id ${sortOrder}
            LIMIT 10 OFFSET ${(pageNum - 1) * 10}`
        );
        return queryResults || [];
    } else {
        const queryResults = await db.query(
            `SELECT * 
            from trips as a 
            WHERE a.status = '${STATUS_ACTIVE}' and a.department = '${user.department}' and a.created_by = '${user.username}'
            ORDER BY a._id ${sortOrder}
            LIMIT 10 OFFSET ${(pageNum - 1) * 10}`
        );
        return queryResults || [];
    }
};


exports.update = async (id, data) => {
    const attributes = {
        date_of_request: new Date(),
        requested_by: data.requested_by,
        department: data.department,
        email: data.email,
        local_number: data.local_number,
        contact_number: data.contact_number,
        company: data.company,
        cost_center: data.cost_center,
        date_of_trip_to: data.date_of_trip_to,
        date_of_trip_from: data.date_of_trip_from,
        passenger_type: data.passenger_type,
        total_of_passengers: data.total_of_passengers,
        destination: data.destination,
        contact_person: data.contact_person,
        purpose_of_trip: data.purpose_of_trip,
        pick_up_time: data.pick_up_time,
        pick_up_location: data.pick_up_location,
        estimate_time_of_return: data.estimate_time_of_return,
        trip_type: data.trip_type,
        priority: data.priority,
        driver: data.driver,
        vehicle: data.vehicle,
        type: data.type,
        ticket_status: data.ticket_status,
        date_updated: new Date(),
        updated_by: data.updated_by
    };

    const update = await db.query(`UPDATE trips SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM trips WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating trip record!');
}


exports.delete = async (id) => {
    const attributes = { status: STATUS_INACTIVE };

    const update = await db.query(`UPDATE trips SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM trips WHERE _id = ${id} AND status = '${STATUS_INACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting trips record!');
}

exports.headApproval = async (id, data) => {

    console.log(data.role)
    if (data.role != USER_ROLE_HEAD) { return false };

    const attributes = {
        ticket_status: TICKET_STATUS_APPROVED,
        updated_by: data.username,
        date_updated: new (Date)
    };

    const update = await db.query(`UPDATE trips SET ? WHERE _id = ${id}`, { ...attributes });

    const getAllHeadEmails = await db.query(
        `SELECT a.email FROM users as a WHERE a.status = '${STATUS_ACTIVE}' and a.role ='${USER_ROLE_HEAD}' `
    );

    if (update) {
        const queryResult = await db.query(`SELECT *, DATE_FORMAT(a.date_created, '%Y-%m-%d') as date_created from trips as a
        WHERE a._id = ${id} AND a.status = '${STATUS_ACTIVE}'`);

        sendEmail(TRIP_ADMIN_EMAIL, getAllHeadEmails[0].email, queryResult[0]);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating trips record!');
}

exports.adminApproval = async (id, data, body) => {

    // console.log(data.role)
    // if (data.role != USER_ROLE_ADMIN) { return false };

    console.log(body)
    const attributes = {
        driver: body.driver,
        vehicle: body.vehicle,
        ticket_status: TICKET_STATUS_ONGOING,
        updated_by: data.username,
        date_updated: new (Date)
    };

    const update = await db.query(`UPDATE trips SET ? WHERE _id = ${id}`, { ...attributes });

    const getAllAdminEmails = await db.query(
        `SELECT a.email FROM users as a WHERE a.status = '${STATUS_ACTIVE}' and a.role ='${USER_ROLE_ADMIN}' `
    );

    if (update) {
        const queryResult = await db.query(`SELECT *, DATE_FORMAT(a.date_created, '%Y-%m-%d') as date_created, 
        DATE_FORMAT(a.date_of_trip_to, '%Y-%m-%d') as date_of_trip_to, DATE_FORMAT(a.date_of_trip_from, '%Y-%m-%d') as date_of_trip_from from trips as a JOIN driver_details AS b ON a.driver = b._id
        JOIN vehicle_details AS c ON a.vehicle = c._id
        WHERE a._id = ${id} AND a.status = '${STATUS_ACTIVE}'`);

        sendApprovedEmail(TRIP_APPROVED_EMAIL, getAllAdminEmails[0].email, queryResult[0]);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on updating trips record!');
}

exports.complete = async (id, data, user) => {

    console.log(id)
    if (user.role != USER_ROLE_ADMIN) { return false };

    if (data.ticket_status == TICKET_STATUS_PENDING || data.ticket_status == TICKET_STATUS_APPROVED) {
        return false
    };

    const attributes = { ticket_status: TICKET_STATUS_COMPLETE };

    const update = await db.query(`UPDATE trips SET ? WHERE _id = ${id}`, { ...attributes });

    if (update) {
        const queryResult = await db.query(`SELECT * FROM trips WHERE _id = ${id} AND status = '${STATUS_ACTIVE}'`);
        return queryResult[0] ? queryResult[0] : null;
    }

    throw new Error('Error on deleting trips record!');
}


exports.STATUS_ACTIVE = STATUS_ACTIVE;
exports.STATUS_INACTIVE = STATUS_INACTIVE;
exports.STATUS_DELETED = STATUS_DELETED;

exports.TICKET_STATUS_PENDING = TICKET_STATUS_PENDING;
exports.TICKET_STATUS_APPROVED = TICKET_STATUS_APPROVED;
exports.TICKET_STATUS_DECLINED = TICKET_STATUS_DECLINED;
exports.TICKET_STATUS_ONGOING = TICKET_STATUS_ONGOING;
exports.TICKET_STATUS_COMPLETE = TICKET_STATUS_COMPLETE;

exports.COMPANY_TYPE_L = COMPANY_TYPE_L;
exports.COMPANY_TYPE_V = COMPANY_TYPE_V

exports.PASSENGER_TYPE_VIP = PASSENGER_TYPE_VIP;
exports.PASSENGER_TYPE_GUE = PASSENGER_TYPE_GUE;
exports.PASSENGER_TYPE_INS = PASSENGER_TYPE_INS;
exports.PASSENGER_TYPE_AUD = PASSENGER_TYPE_AUD;
exports.PASSENGER_TYPE_OTH = PASSENGER_TYPE_OTH;

exports.PRIORITY_HIGH = PRIORITY_HIGH;
exports.PRIORITY_URG = PRIORITY_URG;
exports.PRIORITY_STD = PRIORITY_STD;

exports.TRIP_TYPE_DO = TRIP_TYPE_DO;
exports.TRIP_TYPE_DP = TRIP_TYPE_DP;
exports.TRIP_TYPE_WT = TRIP_TYPE_WT;

// DB
// CREATE TABLE dms.trips (
//     _id INT AUTO_INCREMENT PRIMARY KEY,
//     date_of_request DATETIME,
//     requested_by VARCHAR(255),
//     department VARCHAR(255),
//     email VARCHAR(255),
//     local_number VARCHAR(255),
//     contact_number VARCHAR(255),
//     company VARCHAR(255),
//     cost_center VARCHAR(255),
//     date_of_trip_to DATE,
//     date_of_trip_from DATE,
//     passenger_type VARCHAR(255),
//     total_of_passengers INT,
//     destination VARCHAR(255),
//     contact_person VARCHAR(255),
//     purpose_of_trip VARCHAR(255),
//     pick_up_time  VARCHAR(255),
//     pick_up_location VARCHAR(255),
//     estimate_time_of_return  VARCHAR(255),
//     trip_type VARCHAR(255),
//     priority VARCHAR(255),
//     driver INT,
//     vehicle INT,
//     type VARCHAR(255),
//     ticket_status VARCHAR(255),
//     remarks VARCHAR(255),
//     errands VARCHAR(255),
//     status VARCHAR(255),
//     date_created DATETIME,
//     date_updated DATETIME,
//     created_by VARCHAR(255),
//     updated_by VARCHAR(255),
//     FOREIGN KEY (driver) REFERENCES driver_details(_id),
//     FOREIGN KEY (vehicle) REFERENCES vehicle_details(_id)
//   );