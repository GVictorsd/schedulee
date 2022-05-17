
//index.js

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const sqlite3 = require('sqlite3');

// middleware
app.use(express.json());
app.use(express.urlencoded());


const databaseName = 'mydata.db';

// open the database
const db = new sqlite3.Database(databaseName, (err) => {
    if(err) {
        console.log('Error with the database: ', err);
    }
    else{
        console.log('Opened database');
    }
});

CreateT2();
CreateDevices();
CreateT1();
CreateT3();


// ---- index page ----
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
})

// ---- Admin Routes(APIs) ----

app.post('/adminAddUser', (req, res) => {
    db.run(`
        INSERT INTO T2(uname, previlage)
        VALUES (
            '${req.body.uname}',
            ${req.body.previlage}
        )`, (err) => {
            if(err){
                console.log(err);
                var response = {'response': 'fail'};
                res.send(JSON.stringify(response));
            } else{
                var response = {'response': 'success'};
                res.send(JSON.stringify(response));
            }
        })
})

app.post('/adminAddDevices', (req, res) => {
    db.run(`
        INSERT INTO Devices(roomNo, devices)
        VALUES (
            ${req.body.roomno},
            '${req.body.devices}'
        )`, (err) => {
            if(err) {
                console.log(err);
                var response = {'response': 'fail'};
                res.send(JSON.stringify(response));
            }else{
                var response = {'response': 'success'};
                res.send(JSON.stringify(response));
            }
        })
})


// ---- User Routes(APIs) ----

app.post('/user', (req, res) => {
    var response = {'status': 'done'};
    console.log(req.body);
    res.send(JSON.stringify(response));
})


app.post('/pst', (req, res) => {
    console.log('request received');
    console.log(req.body);
});

app.get('/gt', (req, res) => {
    var msg = {'hello' : 'world'};
    console.log('Get received');
    res.send(JSON.stringify(msg));
})

function AddDataT2(uname, previlage){
    db.run(`
        INSERT INTO T2(uname, previlage)
        VALUES (
            '${uname}',
            ${previlage}
        )`, (err) => {
            if(err){
                console.log(err);
                return false;
            } else{
                return true;
            }
        })
}

function AddDataDevices(roomno, devices){
    db.run(`
        INSERT INTO Devices(roomNo, devices)
        VALUES (
            ${roomno},
            '${devices}'
        )`, (err) => {
            if(err) {
                console.log(err);
                return 0;
            }
            console.log('***** Success');
            return 1;
        })
}

function CreateT1(){
    db.run(`
        CREATE TABLE T1 (
            scheduleNo INTEGER PRIMARY KEY AUTOINCREMENT,
            uid INTEGER NOT NULL,
            roomNo INTEGER NOT NULL,
            timefrom INTEGER NOT NULL,
            timeto INTEGER NOT NULL,

            FOREIGN KEY(uid) REFERENCES T2(uid),
            FOREIGN KEY(roomNo) REFERENCES Devices(roomNo)
        )`, (err) => {
            if(err){
                console.log(err);
                return false;
            } else {
                // executed successfully
                return true;
            }
        })
}
function CreateDevices(){
    db.run(`
        CREATE TABLE Devices (
            roomNo INTEGER PRIMARY KEY,
            devices VARCHAR(255) NOT NULL
        )`, (err) => {
            if(err){
                console.log(err);
                return false;
            }else{
                // executed successfully
                return true;
            }
        })
}
function CreateT2(){
    db.run(`
        CREATE TABLE T2 (
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            uname VARCHAR(255) NOT NULL UNIQUE,
            previlage INTEGER NOT NULL
        )`, (err) => {
            if(err){
                console.log(err);
                return false;
            }else{
                // executed succesfully
                return true;
            }
        })
}
function CreateT3(){
    db.run(`
        CREATE TABLE T3 (
            scheduleNo INTEGER NOT NULL,
            devices VARCHAR(255) NOT NULL,

            FOREIGN KEY(scheduleNo) REFERENCES T1(scheduleNo)
        )`, (err) => {
            if(err){
                console.log(err);
                return false;
            }else{
                // executed successfully
                return true;
            }
        })
}



const port = 3000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// ref:
// app.route('/route')
//     .get((req, res) => {
//         ...
//     })
//     .post((req, res) => {
//         ...
//     })
//     .put((req, res) => {
//         ...
//     })
//     .delete((req, res) => {
//         ...
//     })