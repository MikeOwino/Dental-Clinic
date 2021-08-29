const app = require('./app');
let { connection } = require("./config");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const data = require('./createDataBase');
data.createDataBase();



async function isLoggedInSuperAdmin(req, res, next) {
    const id = req.header("id");
    const token = req.header("token");
    const isAdmin = req.header("isAdmin");

    let sql = `SELECT * FROM admins WHERE token LIKE '${token}'`;
    if (isAdmin && token) {
        try {
            const decoded = jwt.verify(token, "randomString", { ignoreExpiration: true });
            if (id == decoded.id) {
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result && result[0].id && result[0].id == id && result[0].role_id == 0)
                        next();
                });
            }
        } catch (e) {
            next(e);
        }
    } else { res.json({ success: false }); }
}

async function isLoggedInAdmin(req, res, next) {
    const id = req.header("id");
    const token = req.header("token");
    const isAdmin = req.header("isAdmin");

    let sql = `SELECT * FROM admins WHERE token LIKE '${token}'`;
    if (isAdmin && token) {
        try {
            const decoded = jwt.verify(token, "randomString", { ignoreExpiration: true });
            if (id == decoded.id) {
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result && result[0].id && result[0].id == id)
                        next();
                });
            }
        } catch (e) {
            next(e);
        }
    } else { res.json({ success: false }); }
}

async function isLoggedIn(req, res, next) {
    const id = req.header("id");
    const token = req.header("token");
    const isAdmin = req.header("isAdmin");

    let sql = ``;

    (isAdmin == true || isAdmin == "true") ?
        sql = `SELECT * FROM admins WHERE token LIKE '${token}'` :
        sql = `SELECT * FROM patients WHERE token LIKE '${token}'`;

    if (token) {
        try {
            const decoded = jwt.verify(token, "randomString", { ignoreExpiration: true });
            if (id == decoded.id) {
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result && result[0].id && result[0].id == id)
                        next();
                });
            }
        } catch (e) {
            next(e);
        }
    } else { res.json({ success: false }); }
}



const start = async () => {

    // GET BY USERNAME
    app.post("/getUserData", isLoggedIn, async (req, res, next) => {
        try {
            const { username, isAdmin } = req.body;
            let sql = ``;
            try {
                (isAdmin == true) ?
                    sql = `SELECT * FROM admins WHERE username = '${username}'` :
                    sql = `SELECT * FROM patients WHERE username = '${username}'`;

                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.json({ success: true, result: result[0] });
                });
            } catch (e) {
                next(e);
            }
        } catch (e) {
            next(e);
        }
    });

    // GET LIST ADMIN
    app.get('/admin', isLoggedInSuperAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM admins WHERE role_id = '1' ORDER BY first_name`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE ADMIN
    app.get('/admin/:id', isLoggedInSuperAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM admins WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE ADMIN
    app.delete('/admin/:id', isLoggedInSuperAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM admins WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE ADMIN
    app.put('/admin/:id', isLoggedInSuperAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { username, password, first_name, middle_name, last_name, phone } = req.body;
        let att = ``;
        let attValues = [];

        if (username) {
            att += ` username = ? , `;
            attValues.push(username);
        }
        if (password) {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt);

            att += ` password = ? , `;
            attValues.push(hashedPassword);
        }
        if (first_name) {
            att += ` first_name = ? , `;
            attValues.push(first_name);
        }
        if (middle_name) {
            att += ` middle_name = ? , `;
            attValues.push(middle_name);
        }
        if (last_name) {
            att += ` last_name = ? , `;
            attValues.push(last_name);
        }
        if (phone) {
            att += ` phone = ? , `;
            attValues.push(phone);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE admins SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE ADMIN
    app.post('/admin', isLoggedInSuperAdmin, async (req, res, next) => {
        const { username, password, first_name, middle_name, last_name, phone } = req.body;

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let att = "username, password, first_name, middle_name, last_name, phone";
        let values = [username, hashedPassword, first_name, middle_name, last_name, phone];
        let inValues = "?, ?, ?, ?, ?, ?";

        try {
            let sql = `INSERT INTO admins(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST TYPE
    app.get('/type', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM types ORDER BY description`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE TYPE
    app.get('/type/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM types WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE TYPE
    app.post('/type', isLoggedInAdmin, async (req, res, next) => {
        const { description, bill } = req.body;
        let att = "description, bill";
        let values = [description, bill];
        let inValues = "?, ?";
        try {
            let sql = `INSERT INTO types(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE TYPE
    app.delete('/type/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM types WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE TYPE
    app.put('/type/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { description, bill } = req.body;
        let att = ``;
        let attValues = [];

        if (description) {
            att += ` description = ? ,`;
            attValues.push(description);
        }
        if (bill) {
            att += ` bill = ? ,`;
            attValues.push(bill);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE types SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST TEETH
    app.post('/tooth', isLoggedInAdmin, async (req, res, next) => {
        const { category } = req.body;
        let att = ``;

        if (category) {
            att += `WHERE category = '${category}' `;
        }

        try {
            let sql = `SELECT * FROM teeth ${att} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST CLINIC
    app.get('/clinic', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM clinics ORDER BY name`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE CLINIC
    app.get('/clinic/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM clinics WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE CLINIC
    app.post('/clinic', isLoggedInAdmin, async (req, res, next) => {
        const { name } = req.body;
        let att = "name";
        let values = [name];
        let inValues = " ? ";
        try {
            let sql = `INSERT INTO clinics(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE CLINIC
    app.delete('/clinic/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM clinics WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE CLINIC
    app.put('/clinic/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;
        let att = ``;
        let attValues = [];

        if (name) {
            att += ` name = ? `;
            attValues.push(name);
        }

        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE clinics SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST PATIENT COUNT
    app.post('/patientcount', isLoggedInAdmin, async (req, res, next) => {
        let { name } = req.body;
        let att = ``;
        let names = name.split(' ');

        if (names.length == 1) {
            att += ` WHERE first_name LIKE '${names}%'`;
            att += ` OR last_name LIKE '${names}%'`;
        }
        else if (names.length > 1) {
            if (names[0] && names[0] !== "") {
                att += ` WHERE first_name LIKE '${names[0]}%'`;
            }
            if (names[1] && names[1] !== "") {
                att += ` AND middle_name LIKE '${names[1]}%'`;
            }
            if (names[2] && names[2] !== "") {
                att += ` AND last_name LIKE '${names[2]}%'`;
            }
        }
        try {
            let sql = `SELECT COUNT(id) AS row FROM patients ${att} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0].row });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST PATIENT WITH PAGINATION
    app.post('/paginpatient', isLoggedInAdmin, async (req, res, next) => {
        let { rows, orderBy, desc, name } = req.body;
        let att = ``;

        let names = name.split(' ');

        if (names.length == 1) {
            att += ` WHERE first_name LIKE '${names}%'`;
            att += ` OR last_name LIKE '${names}%'`;
            att += ` OR id LIKE '${names}%'`;
        }
        else if (names.length > 1) {
            if (names[0] && names[0] !== "") {
                att += ` WHERE first_name LIKE '${names[0]}%'`;
            }
            if (names[1] && names[1] !== "") {
                att += ` AND middle_name LIKE '${names[1]}%'`;
            }
            if (names[2] && names[2] !== "") {
                att += ` AND last_name LIKE '${names[2]}%'`;
            }
        }
        if (orderBy && orderBy != "") {
            att += `ORDER BY ${orderBy} `;
        }
        if (desc) {
            att += ` DESC`
        }

        try {
            let sql = `SELECT * FROM patients ${att} LIMIT ${rows}, 10`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        } number
    });

    // GET LIST PATIENT
    app.get('/patient', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM patients ORDER BY first_name`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE PATIENT
    app.get('/patient/:id', isLoggedIn, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM patients WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE PATIENT
    app.delete('/patient/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM patients WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE PATIENT
    app.put('/patient/:id', isLoggedIn, async (req, res, next) => {
        const { id } = req.params;
        const { username, password, first_name, middle_name, last_name, phone, gender, birth, marital, health, address } = req.body;
        let att = ``;
        let attValues = [];

        if (username) {
            att += ` username = ? ,`;
            attValues.push(username);
        }
        if (password) {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt);

            att += ` password = ? ,`;
            attValues.push(hashedPassword);
        }
        if (first_name) {
            att += ` first_name = ? ,`;
            attValues.push(first_name);
        }
        if (middle_name) {
            att += ` middle_name = ? ,`;
            attValues.push(middle_name);
        }
        if (last_name) {
            att += ` last_name = ? ,`;
            attValues.push(last_name);
        }
        if (phone) {
            att += ` phone = ? ,`;
            attValues.push(phone);
        }
        if (gender) {
            att += ` gender = ? ,`;
            attValues.push(gender);
        }
        if (birth) {
            att += ` birth = ? ,`;
            attValues.push(birth);
        }
        if (marital) {
            att += ` marital = ? ,`;
            attValues.push(marital);
        }
        if (health && health !== "") {
            att += ` health = ? ,`;
            attValues.push(health);
        } else {
            att += ` health = ? ,`;
            attValues.push("Null");
        }
        if (address) {
            att += ` address = ? ,`;
            attValues.push(address);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE patients SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE Patient
    app.post('/patient', isLoggedInAdmin, async (req, res, next) => {
        const { username, password, first_name, middle_name, last_name, phone, gender, birth, marital, health, address } = req.body;

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let att = "username, password, first_name, middle_name, last_name, phone, gender, birth, marital, address ";
        let values = [username, hashedPassword, first_name, middle_name, last_name, phone, gender, birth, marital, address];
        let inValues = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?";

        if (health) {
            att += `, health `;
            inValues += `, ?`;
            values.push(health);
        }
        att = att.slice(0, -1);

        try {
            let sql = `INSERT INTO patients(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST DOCTOR
    app.get('/doctor', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM doctors ORDER BY first_name`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE DOCTOR
    app.get('/doctor/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM doctors WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE DOCTOR
    app.post('/doctor', isLoggedInAdmin, async (req, res, next) => {
        const { first_name, middle_name, last_name, phone } = req.body;
        let att = "first_name, middle_name, last_name, phone";
        let values = [first_name, middle_name, last_name, phone];
        let inValues = "?, ?, ?, ?";
        try {
            let sql = `INSERT INTO doctors(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE DOCTOR
    app.delete('/doctor/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM doctors WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE DOCTOR
    app.put('/doctor/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { first_name, middle_name, last_name, phone } = req.body;
        let att = ``;
        let attValues = [];

        if (first_name) {
            att += ` first_name = ? , `;
            attValues.push(first_name);
        }
        if (middle_name) {
            att += ` middle_name = ? , `;
            attValues.push(middle_name);
        }
        if (last_name) {
            att += ` last_name = ? , `;
            attValues.push(last_name);
        }
        if (phone) {
            att += ` phone = ? , `;
            attValues.push(phone);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE doctors SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST REQUEST
    app.get('/request', isLoggedIn, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM requests ORDER BY date DESC`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE REQUEST
    app.get('/request/:id', isLoggedIn, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM requests WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE REQUEST
    app.post('/request', isLoggedIn, async (req, res, next) => {
        const { description, date, status, id_patient } = req.body;
        let att = "description, date, status, id_patient";
        let values = [description, date, status, id_patient];
        let inValues = "?, ?, ?, ?";

        if (description == "") values[0] = "Null";

        try {
            let sql = `INSERT INTO requests(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // Update REQUEST
    app.put('/request/:id', isLoggedIn, async (req, res, next) => {
        const { id } = req.params;
        const { status } = req.body;

        if (status && status !== "") {
            try {
                let sql = `UPDATE requests SET status = '${status}' WHERE id = ${id}`;
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    res.json({ success: true, result });
                });
            } catch (e) {
                next(e);
            }
        }
    });

    // DELETE REQUEST
    app.delete('/request/:id', isLoggedIn, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM requests WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST APPOINTMENT
    app.get('/appointment', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM appointments`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET SINGLE APPOINTMENT
    app.get('/appointment/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM appointments WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE APPOINTMENT
    app.post('/appointment', isLoggedInAdmin, async (req, res, next) => {
        const { description, date, start_at, end_at, status, id_patient, id_clinic } = req.body;
        let att = "description, date, start_at, end_at, status, id_patient, id_clinic";
        let values = [description, date, start_at, end_at, status, id_patient, id_clinic];
        let inValues = "?, ?, ?, ?, ?, ?, ?";

        if (description == "") values[0] = "Null";

        try {
            let sql = `INSERT INTO appointments(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE APPOINTMENT
    app.delete('/appointment/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM appointments WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE APPOINTMENT
    app.put('/appointment/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { description, data, start_at, end_at, status, id_patient, id_clinic } = req.body;
        let att = ``;
        let attValues = [];

        if (description) {
            att += ` description = ? , `;
            attValues.push(description);
        }
        if (data) {
            att += ` data = ? , `;
            attValues.push(data);
        }
        if (start_at) {
            att += ` start_at = ? , `;
            attValues.push(start_at);
        }
        if (end_at) {
            att += ` end_at = ? , `;
            attValues.push(end_at);
        }
        if (status) {
            att += ` status = ? , `;
            attValues.push(status);
        }
        if (id_patient) {
            att += ` id_patient = ? , `;
            attValues.push(id_patient);
        }
        if (id_clinic) {
            att += ` id_clinic = ? , `;
            attValues.push(id_clinic);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE appointments SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST PROCEDURE
    app.get('/procedure', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM procedures`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE PROCEDURE
    app.get('/procedure/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM procedures WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE PROCEDURE
    app.post('/procedure', isLoggedInAdmin, async (req, res, next) => {
        const { date, payment, id_patient, id_doctor, balance } = req.body;
        let att = "date, id_patient";
        let values = [date, id_patient];
        let inValues = "?, ?";

        if (id_doctor) {
            att += `, id_doctor`;
            inValues += `, ? `
            values.push(id_doctor);
        }
        if (payment) {
            att += `, payment`;
            inValues += `, ? `
            values.push(payment);
        }
        if (balance) {
            att += `, balance`;
            inValues += `, ? `
            values.push(balance);
        }

        try {
            let sql = `INSERT INTO procedures(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE PROCEDURE
    app.delete('/procedure/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM procedures WHERE id = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // UPDATE PROCEDURE
    app.put('/procedure/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        const { date, payment, id_patient, id_doctor, id_clinic, balance } = req.body;
        let att = ``;
        let attValues = [];

        if (date) {
            att += ` date = ? , `;
            attValues.push(date);
        }
        if (payment) {
            att += ` payment = ? , `;
            attValues.push(payment);
        }
        if (id_patient) {
            att += ` id_patient = ? , `;
            attValues.push(id_patient);
        }
        if (id_doctor) {
            att += ` id_doctor = ? , `;
            attValues.push(id_doctor);
        }
        if (id_clinic) {
            att += ` id_clinic = ? , `;
            attValues.push(id_clinic);
        }
        if (balance) {
            att += ` balance = ? , `;
            attValues.push(balance);
        }

        att = att.slice(0, -1);
        att += ` WHERE id = ? `
        attValues.push(id);

        try {
            let sql = `UPDATE procedures SET ${att} `;
            connection.query(sql, attValues, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET LIST P_T_C
    app.get('/PTC', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT * FROM P_T_C`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // READ SINGLE P_T_C
    app.get('/PTC/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `SELECT * FROM P_T_C WHERE id = ${id} LIMIT 1`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE P_T_C
    app.post('/PTC', isLoggedInAdmin, async (req, res, next) => {
        const { id_procedure, id_type, id_teeth, price } = req.body;
        let att = "id_procedure, id_type, id_teeth, price";
        let values = [id_procedure, id_type, id_teeth, price];
        let inValues = "?, ?, ?, ?";

        if (price == "") values[3] = 0;

        try {
            let sql = `INSERT INTO P_T_C(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // DELETE P_T_C ALL
    app.delete('/PTCALL/:id', isLoggedInAdmin, async (req, res, next) => {
        const { id } = req.params;
        try {
            let sql = `DELETE FROM P_T_C WHERE id_procedure = ${id} `;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN P_T_C_D_P
    app.get('/PTCDP', isLoggedIn, async (req, res, next) => {

        try {
            let sql = `SELECT
        
                    P_T_C.id,
                    P_T_C.price,
        
                    P_T_C.id_procedure,
                    procedures.payment,
                    procedures.date,
        
                    P_T_C.id_type,
                    types.description,
                    types.bill,
        
                    P_T_C.id_teeth,
                    teeth.category,
        
                    procedures.id_patient,
                    procedures.id_doctor
        
                    FROM P_T_C     
                    JOIN procedures ON procedures.id = P_T_C.id_procedure
                    JOIN types ON types.id = P_T_C.id_type
                    JOIN teeth ON teeth.id = P_T_C.id_teeth`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P
    app.get('/ACP', isLoggedIn, async (req, res, next) => {
        try {

            let sql = `SELECT

                    appointments.*,
        
                    patients.first_name,
                    patients.middle_name,
                    patients.last_name,
                    patients.phone,
        
                    clinics.name
            
                    FROM appointments 
                    JOIN clinics ON clinics.id = appointments.id_clinic
                    JOIN patients ON patients.id = appointments.id_patient
            `;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN P_D_P
    app.get('/PDP', isLoggedIn, async (req, res, next) => {
        try {

            let sql = `SELECT

                    procedures.*,
        
                    patients.first_name as f_n_patient,
                    patients.middle_name as m_n_patient,
                    patients.last_name as l_n_patient,
        
                    doctors.first_name as f_n_doctor,
                    doctors.middle_name as m_n_doctor,
                    doctors.last_name as l_n_doctor

                    FROM procedures 
                    LEFT JOIN patients ON patients.id = procedures.id_patient
                    LEFT JOIN doctors ON doctors.id = procedures.id_doctor`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P
    app.get('/RP', isLoggedInAdmin, async (req, res, next) => {
        try {

            let sql = `SELECT

                    requests.id,
                    requests.description,
                    requests.status,
                    requests.date,
                    requests.id_patient,
        
                    patients.first_name,
                    patients.middle_name,
                    patients.last_name
                    
                    FROM requests 
                    JOIN patients ON patients.id = requests.id_patient`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P
    app.post('/balance', isLoggedInAdmin, async (req, res, next) => {
        let { id, dateFrom, dateTo } = req.body;

        try {
            let arr = [];
            let getsql = `SELECT * FROM patients`;

            let sql = `SELECT

                       patients.id,
                       patients.first_name,
                       patients.middle_name,
                       patients.last_name,
           
                       procedures.payment,
                       procedures.balance,
                       procedures.date

                       FROM patients 
                       LEFT JOIN procedures ON patients.id = procedures.id_patient`;

            connection.query(sql, function (err, result) {
                if (err) throw err;

                connection.query(getsql, function (err, data) {
                    if (err) throw err;

                    data.map(idss => {

                        let balanceTotal = 0;
                        let paymentTotal = 0;

                        result.filter(r => (
                            ((dateFrom && dateFrom != "") && (dateTo && dateTo != "")) ?
                                (
                                    new Date(r.date).getTime() >= new Date(dateFrom).getTime()
                                    &&
                                    new Date(r.date).getTime() <= new Date(dateTo).getTime()
                                    &&
                                    r.id === idss.id
                                ) :
                                (r.id === idss.id)
                        ))
                            .map(r => {
                                balanceTotal += r.balance;
                                paymentTotal += r.payment;
                            });

                        arr.push({
                            id: idss.id,
                            first_name: idss.first_name,
                            middle_name: idss.middle_name,
                            last_name: idss.last_name,
                            payment: paymentTotal,
                            balance: balanceTotal
                        });

                    });
                    if (id && id != "") arr = arr.find(a => a.id == id);
                    res.json({ success: true, result: arr });
                });

            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P FOR PATIENT
    app.post('/balanceData', isLoggedIn, async (req, res, next) => {
        let { id } = req.body;

        try {
            let arr = [];
            let getsql = `SELECT * FROM patients WHERE id = ${id}`;

            let sql = `SELECT

                       patients.id,
                       patients.first_name,
                       patients.middle_name,
                       patients.last_name,
           
                       procedures.payment,
                       procedures.balance,
                       procedures.date

                       FROM patients 
                       LEFT JOIN procedures ON patients.id = procedures.id_patient`;

            connection.query(sql, function (err, result) {
                if (err) throw err;

                connection.query(getsql, function (err, data) {
                    if (err) throw err;

                    data.map(idss => {

                        let balanceTotal = 0;
                        let paymentTotal = 0;

                        result.filter(r => r.id === idss.id)
                            .map(r => {
                                balanceTotal += r.balance;
                                paymentTotal += r.payment;
                            });

                        arr.push({
                            id: idss.id,
                            first_name: idss.first_name,
                            middle_name: idss.middle_name,
                            last_name: idss.last_name,
                            payment: paymentTotal,
                            balance: balanceTotal
                        });

                    });
                    if (id && id != "") arr = arr.find(a => a.id == id);
                    res.json({ success: true, result: arr });
                });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P
    app.get('/balance/:id', isLoggedIn, async (req, res, next) => {
        let { id } = req.params;
        try {
            let sql = `SELECT

                       procedures.id,
                       procedures.payment,
                       procedures.balance,
                       procedures.date
                    
                       FROM patients 
                       LEFT JOIN procedures ON patients.id = procedures.id_patient
                       WHERE patients.id = ${id} `;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET JOIN A_C_P
    app.get('/maxmindate', isLoggedInAdmin, async (req, res, next) => {
        try {
            let sql = `SELECT
                       MAX(date) as max,
                       Min(date) as min
                       from procedures`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result: result[0] });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET All PHONE NUMBER
    app.get('/phonenumber', async (req, res, next) => {
        try {
            let arr = [];

            let sql_a = `SELECT phone FROM admins`;

            let sql_d = `SELECT phone FROM doctors`;

            let sql_p = `SELECT phone FROM patients`;

            connection.query(sql_a, function (err, result) {
                if (err) throw err;
                result.map(r => arr.push(r));

                connection.query(sql_d, function (err, result) {
                    if (err) throw err;
                    result.map(r => arr.push(r));

                    connection.query(sql_p, function (err, result) {
                        if (err) throw err;
                        result.map(r => arr.push(r));

                        res.json({ success: true, result: arr });
                    });
                });
            });
        } catch (e) {
            next(e);
        }
    });

    // GET All USERNAME
    app.get('/username', async (req, res, next) => {
        try {
            let arr = [];

            let sql_a = `SELECT username FROM admins`;

            let sql_p = `SELECT username FROM patients`;

            connection.query(sql_a, function (err, result) {
                if (err) throw err;
                result.map(r => arr.push(r));

                connection.query(sql_p, function (err, result) {
                    if (err) throw err;
                    result.map(r => arr.push(r));

                    res.json({ success: true, result: arr });
                });
            });
        } catch (e) {
            next(e);
        }
    });

    //LOGIN
    app.post('/login', async (req, res, next) => {
        const { username, password } = req.body;
        try {
            let sql_a = `SELECT * FROM admins`;
            let sql_p = `SELECT * FROM patients`;
            let log = ``;

            connection.query(sql_a, async function (err, data) {
                if (err) throw err;
                let admin = data.find(r => r.username == username);

                if (admin) {
                    log = `UPDATE admins SET token = ? WHERE id = ? `;
                    let isMatch = await bcrypt.compare(password, admin.password);
                    if (isMatch) {
                        let payload = { id: admin.id };
                        let token = jwt.sign(payload, "randomString", { expiresIn: 10000 });

                        connection.query(log, [token, admin.id], function (err, result) {
                            if (err) throw err;
                            result['isAdmin'] = true;
                            result['admin'] = admin;
                            result['token'] = token;
                            res.json({ success: true, result });
                        });
                    }
                }
                else {
                    connection.query(sql_p, async function (err, datas) {
                        if (err) throw err;
                        let patient = await datas.find(r => r.username == username);

                        if (patient) {
                            log = `UPDATE patients SET token = ? WHERE id = ? `;
                            let isMatch = bcrypt.compare(password, patient.password);
                            if (isMatch) {
                                let payload = { id: patient.id };
                                let token = jwt.sign(payload, "randomString", { expiresIn: 10000 });

                                connection.query(log, [token, patient.id], function (err, result) {
                                    if (err) throw err;
                                    result['isAdmin'] = false;
                                    result['patient'] = patient;
                                    result['token'] = token;
                                    res.json({ success: true, result });
                                });
                            }
                        }
                    });
                }
            });
        } catch (e) {
            next(e);
        }
    });

    //LOGOUT
    app.post('/logout', async (req, res, next) => {
        const { username } = req.body;
        try {
            let sql_a = `SELECT * FROM admins`;
            let sql_p = `SELECT * FROM patients`;
            let log = ``;

            connection.query(sql_a, function (err, data) {
                if (err) throw err;
                let admin = data.find(r => r.username == username);

                if (admin) {
                    log = `UPDATE admins SET token = ? WHERE id = ? `;
                    connection.query(log, [null, admin.id], function (err, result) {
                        if (err) throw err;
                        res.json({ success: true, result });
                    });
                }
                else {
                    connection.query(sql_p, function (err, datas) {
                        if (err) throw err;
                        let patient = datas.find(r => r.username == username);

                        if (patient) {
                            log = `UPDATE patients SET token = ? WHERE id = ? `;
                            connection.query(log, [null, patient.id], function (err, result) {
                                if (err) throw err;
                                res.json({ success: true, result });
                            });
                        }
                    });
                }
            });
        } catch (e) {
            next(e);
        }
    });

    //SIGNUP
    app.post('/signup', async (req, res, next) => {
        try {
            const { username, password, first_name, middle_name, last_name, phone, gender, birth, marital, health, address } = req.body;

            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt);

            let att = "username, password, first_name, middle_name, last_name, phone, gender, birth, marital, health, address";
            let values = [username, hashedPassword, first_name, middle_name, last_name, phone, gender, birth, marital, health, address];
            let inValues = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?";

            if (health == "") values[9] = "Null";

            let sql = `INSERT INTO patients(${att}) VALUES(${inValues})`;
            connection.query(sql, values, function (err, result) {
                if (err) throw err;

                let id = result && result.insertId;
                let payload = { id: id };
                let token = jwt.sign(payload, "randomString", { expiresIn: 10000 });
                let query = 'update patients SET token = ? where id = ?';

                connection.query(query, [token, id], (err, data) => {
                    if (err) throw err;
                    data['id'] = id;
                    data['token'] = token;
                    data['isAdmin'] = false;
                    res.json({ success: true, result: data });
                });

            });
        } catch (e) {
            next(e);
        }
    });

    // CREATE Patient
    app.post('/intialpatient', isLoggedInSuperAdmin, async (req, res, next) => {
        const { number } = req.body;

        try {
            let sql = `INSERT INTO patients(username, password, first_name, middle_name, last_name, phone, gender, birth, marital, health, address) VALUES`;

            for (let i = 1; i <= parseInt(number); i++) {

                let values = `('${i + "***"}', '${"***"}', '${"***"}', '${"***"}', '${"***"}', ${i}, '${"Male"}', '${"2020-01-01"}', '${"Single"}', '${"***"}', '${"***"}'), `;

                sql += values;
            }

            sql = sql.slice(0, -1);
            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.json({ success: true, result });
            });

        } catch (e) {
            next(e);
        }
    });

}

start();

app.listen(process.env.PORT || 8000, () => console.log('server listening on port 8000'));