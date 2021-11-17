const { request } = require('express');
const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
var dir = './tmp';
var path = require('path');
var mkdirp = require('mkdirp');
const fse = require('fs-extra');

const fastestValidator = require('fastest-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const { check, validationResult } = require('express-validator');

var cors = require('cors');

var lot = null;
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    database: 'resumeupload'
});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs")

app.use
    (session({
        key: "user",
        secret: "ThisIsTheSecretUsedToSignInTheSessionCookie",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24 * 1000
        }
    }))

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/api/signup', urlencodedParser, [
    check('fullName', 'Full name must contain atleast 4 alphabets')
        .exists()
        .isLength({ min: 4 }),
    check('email', 'Email is invalid')
        .isEmail(),
    check('password', 'Password must contain atleast 8 characters')
        .exists()
        .isLength({ min: 8 })
], (req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log("signup", validationResult(req))

    if (!errors.isEmpty()) {
        console.log("error in signup");
        const alert = errors.mapped();
        res.send({ error: alert });
    }
    else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
                res.send({ message: "Signup failed" });
            }
            else {
                db.query(
                    "INSERT INTO signup (fullName, email, password) VALUES (?,?,?)",
                    [fullName, email, hash],
                    (err, result) => {
                        console.log(err);
                        console.log(result)
                        res.send({ message: "You have been successfully registered" })
                    }
                );
            }
        });
    };
});

app.get("/students", (req, res) => {
    db.query("SELECT * FROM register ", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/api/register', urlencodedParser, [
    check('fullName', 'Full name must contain atleast 4 alphabets')
        .exists()
        .isLength({ min: 4 }),
    check('email', 'Email is invalid')
        .isEmail(),
    check('phone', 'Phone number must contain 10 digits')
        .exists()
        .isLength({ min: 10 })
], (req, res) => {
    const file = req.body.file;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone = req.body.phone;
    const skill1 = req.body.skill1;
    const skill2 = req.body.skill2;
    const skill3 = req.body.skill3;
    const status = req.body.status;
    const availability = req.body.availability;
    const errors = validationResult(req);
    console.log("register", validationResult(req))

    if (!errors.isEmpty()) {
        console.log("error in register");
        const alert = errors.mapped();
        res.send({ error: alert });
    }
    else {
        db.query(
            "INSERT INTO register (fullName, email, phone, skill1, skill2, skill3, status, availability,file) VALUES (?,?,?,?,?,?,?,?,?)",
            [fullName, email, phone, skill1, skill2, skill3, status, availability, file],
            (err, result) => {
                console.log(err);
                console.log(result)
                res.send({ message: "You have been successfully registered" })
            }
        );
    }
});

app.get("/api/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post('/api/check', (req, res) => {
    const email = req.body.email;
    db.query(
        "SELECT * FROM signup WHERE email = ?;", email,
        (err, result) => {

            if (result.length > 0) {
                console.log("EXISTING USER");
                res.send({ message: "Email already exists" })
            }
        })
})


app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
        "SELECT * FROM signup WHERE email = ?;",
        email,
        (err, result) => {

            if (err) {
                res.send({ err: err });
            }
            else if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    } else {
                        res.send({ message: "Incorrect email or password." });
                    }
                })
            } else {
                res.send({ message: "User doesn't exist" });
            }
        }
    );
});

app.get('/api/get', (req, res) => {
    console.log("Here in write")
    const lot = req.query.lot;
    const directory = '/downloads'
    const fileName = lot + '.txt';
    const sqlSelect = "SELECT unique_code FROM codegenrate WHERE lot_number = ?";
    db.query(sqlSelect, [lot], (err, result) => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            console.log('Directory created');
        }
        else {
            if (fs.existsSync(directory + '/' + fileName)) {
                fs.unlinkSync(directory + '/' + fileName)
            }
            result.forEach(function (value) {
                console.log(value.unique_code);
                fs.appendFileSync(directory + '/' + fileName, value.unique_code + '\n');
            });
        }
        res.send(result);
    });
})
app.get('/api/getstart', (req, res) => {
    const sqlselectstart = "SELECT * FROM codegenrate WHERE  lot_number = ?  ORDER BY id LIMIT 1";
    db.query(sqlselectstart, [lot], (err, result) => {
        res.send(result);
    });
})
app.get('/api/getend', (req, res) => {
    const sqlselectlast = "SELECT * FROM codegenrate WHERE  lot_number = ?  ORDER BY id DESC LIMIT 1";
    db.query(sqlselectlast, [lot], (err, result) => {
        res.send(result);
    });
})
app.get('/api/getclient', (req, res) => {
    const sqlselectClient = "SELECT * FROM client"
    db.query(sqlselectClient, (err, result) => {
        res.send(result);
    });
})
app.get('/api/getdrug', (req, res) => {
    const sqlselectDrug = "SELECT * FROM drug"
    db.query(sqlselectDrug, (err, result) => {
        res.send(result);
    });
})
app.get("/api/search", (req, res) => {
    // console.log("search",drug);
    const sqlsearching = "SELECT * FROM codegenrate WHERE client_code = ? AND drug_code = ?";
    db.query(sqlsearching, [client, drug], (err, result) => {
        res.send(result);
    });
})
app.get("/api/gethistory", (req, res) => {
    console.log("inside fn")
    const drug = req.query.drug;
    const client = req.query.client;
    const lot_num = req.query.lot_num;
    if ((drug != '') && (client != '') || (lot_num != '')) {
        console.log("in if");
        const sqlsearch = "SELECT * FROM codegenrate WHERE client_code = ? AND drug_code = ? ORDER BY id DESC LIMIT 1";
        db.query(sqlsearch, [client, drug], (err, result) => {
            console.log(result);
            console.log(err);
            res.send(result);
        });
    }
})
app.get("/api/gethistorylot", (req, res) => {
    const lot_num = req.query.lot_num;
    if (lot_num != '') {
        const sqlfind = "SELECT * FROM codegenrate WHERE lot_number like CONCAT('%', ? , '%') ORDER BY id DESC LIMIT 1";
        db.query(sqlfind, [lot_num], (err, result) => {
            console.log("in else", lot_num)
            console.log("inside lot query", result)
            res.send(result);
        });
    }
})
app.get("api/getfile", (req, res) => {
    const lot_num = req.query.lot_num;
    const sqlfileWrite = "SELECT * FROM codegenrate WHERE lot_number = ?";
    db.query(sqlfileWrite, [lot_num], (err, result) => {
        console.log("inside get text file")
        res.send(result);
    });
})
app.post("/api/insertclient",
    urlencodedParser,
    [check('client_name').exists().notEmpty(),
    check('client_code').exists().notEmpty()],
    (req, res) => {
        const client_name = req.body.client_name;
        const client_code = req.body.client_code;
        const errors = validationResult(req);
        console.log("result", validationResult(req))

        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            const alert = errors.mapped();
            res.send({ error: alert });
        }
        else {
            const sqlclientinsert = "INSERT INTO client (client_code,client_name) VALUES (?,?)";
            db.query(sqlclientinsert, [client_code, client_name], (err, result) => {
                console.log("in add client");
                res.status(201).send("done");
            });
        }
    });
app.post("/api/insertdrug",
    urlencodedParser,
    [check('drug_name').exists().notEmpty(),
    check('drug_code').exists().notEmpty()],
    (req, res) => {
        const drug_name = req.body.drug_name;
        const drug_code = req.body.drug_code;
        const errors = validationResult(req);
        console.log("result", validationResult(req))

        if (!errors.isEmpty()) {
            console.log(errors.mapped());
            const alert = errors.mapped();
            res.send({ error: alert });
        }
        else {
            const sqldruginsert = "INSERT INTO drug (drug_code,drug_namel) VALUES (?,?)";
            db.query(sqldruginsert, [drug_code, drug_name], (err, result) => {
                res.status(201).send("done");
            });
        }
    });
app.post("/api/insert", (req, res) => {
    const drug = req.body.drug;
    const client = req.body.client;
    const count = req.body.count;
    var tempDate = new Date();
    const lot_num = drug + tempDate.getFullYear().toString().substr(-2) + (tempDate.getMonth() + 1) + tempDate.getDate() + tempDate.getHours() + tempDate.getMinutes() + tempDate.getSeconds();

    for (let i = 0; i < count; i++) {
        const sqlInsert = "INSERT INTO codegenrate (drug_code, client_code) VALUES (?,?)";
        db.query(sqlInsert, [drug, client], (err, result) => {
            console.log(result);
            console.log(err);
            const sqlupdate = "UPDATE codegenrate SET unique_code = CONCAT(drug_code,client_code,id), lot_number = ?,isUniquecodeCreated = 1 WHERE isUniquecodeCreated = 0;"
            db.query(sqlupdate, [lot_num], (err, result) => {
                if (err)
                    console.log(err + "error");
                if (i == (count - 1))
                    res.status(201).send("Done");
            });
        });
    }
    lot = lot_num;
});
app.listen(5001, () => {
    console.log("it is running");
});













// sudo /Applications/XAMPP/xamppfiles/bin/mysql.server start