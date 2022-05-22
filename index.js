
//index.js

// const { fail } = require('assert');
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
app.post('/userDevices', (req, res) => {
    console.log('user Date Route');
    console.log(req.body);
    var response = {
        'response': 'success',
        'data': 'T3 Table modified successfully'
    }
    res.send(JSON.stringify(response));
})

app.post('/user', (req, res) => {
    // Route regarding table T1
    console.log(req.body);
    var from = JSON.parse(req.body.from);
    req.body.from = new Date(from.yr, from.month, from.date, from.hr, from.min, from.sec).getTime();
    var to = JSON.parse(req.body.to);
    req.body.to = new Date(to.yr, to.month, to.date, to.hr, to.min, to.sec).getTime();

    var uname, roomno;
    var errorSent = 0;  // variable to ensure response was returned just once

    // Check if the requested UserName exists in table T2
    db.all(`SELECT * FROM T2 WHERE uname = '${req.body.uname}'`, (err, result) => {
        if(err){
            console.log(err);
            var response = {
                'response' : 'fail',
                'msg' : 'UserName Not Found'
            };
            if(errorSent == 0){
                errorSent++;
                res.send(JSON.stringify(response));
            }
        }
        else {
            if(result.length != 0){
                // userName found! store the queried data
                uname = result[0];
                console.log(uname);
            }
            else{
                // no result was returned (no such userName)
                var response = {
                    'response' : 'fail',
                    'msg' : 'UserName Not Found'
                };
                if(errorSent == 0){
                    errorSent++;
                    res.send(JSON.stringify(response));
                }
            }
        }
    })

    // Check if the requested Room Number Exists
    db.all(`SELECT * FROM Devices WHERE roomNo = ${req.body.roomno}`, (err, result) => {
        if(err){
            console.log(err);
            var response = {
                'response' : 'fail',
                'msg' : 'Room Not Found'
            };
            if(errorSent == 0){
                errorSent++;
                res.send(JSON.stringify(response));
            }
        }
        else {
            if(result.length != 0){
                // Room exists! Store the queried data
                roomno = result[0];
                console.log(roomno);
            }
            else{
                // no response received(no such room found)
                var response = {
                    'response' : 'fail',
                    'msg' : 'Room Not Found'
                };
                if(errorSent == 0){
                    errorSent++;
                    res.send(JSON.stringify(response));
                }
            }
        }
    })

    // in T1, see if the room was booked before and if any of those bookings collide with
    // current booking time
    db.all(`SELECT * FROM T1 WHERE roomNo = ${req.body.roomno}`, (err, result) => {
        console.log('checking T1 for other bookings of the room');
        if(err){
            console.log(err);
            var response = {
                'response' : 'fail',
                'msg': 'Database error'
            };
            if(errorSent == 0){
                errorSent++;
                res.send(JSON.stringify(response));
            }
        }
        else{
            console.log('no database error found');
            var taken = false;
            for(var i in result){
                // TODO: check for priority before
                console.log('Checking room: ' + result[i].timefrom + '-> ' + result[i].timeto);
                if((result[i].timefrom >= req.body.from && result[i].timefrom <= req.body.to) ||
                    (result[i].timeto >= req.body.from && result[i].timeto <= req.body.to)){
                        taken = true;
                        break;
                }
            }
            if(taken){
                // the timeslot is not available
                console.log('Room already taken');
                var response = {
                    'response': 'fail',
                    'msg': 'Time Slot already taken'
                };
                if(errorSent == 0){
                    errorSent++;
                    res.send(JSON.stringify(response));
                }
            }
            else{
                //Update the database and send +ve response(list of Devices in the room)
                console.log('room available!!');
                if(uname && roomno){
                    console.log('running insert operation');
                    db.run(`
                        INSERT INTO T1(uid, roomNo, timefrom, timeto)
                        VALUES (
                            ${uname.uid},
                            ${req.body.roomno},
                            ${req.body.from},
                            ${req.body.to}
                        )`, (err) => {
                            if(err){
                                console.log(err);
                                var response = {
                                    'response': 'fail',
                                    'msg': 'DataBase Error'
                                };
                                if(errorSent == 0){
                                    errorSent++;
                                    res.send(JSON.stringify(response));
                                }
                            }
                            else{
                                // Updated database successfully
                                // send Devices in the room

                                // get schedule number for the current entry
                                db.all(`SELECT max(scheduleNo) FROM T1`, (err, result) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    console.log(result);

                                    var response = {
                                        'response': 'success',
                                        'msg': 'List of Devices:',
                                        'scheduleNo' : `${result[0]['max(scheduleNo)']}`,
                                        'Devices': roomno.devices
                                    };
                                    if(errorSent == 0){
                                        errorSent++;
                                        res.send(JSON.stringify(response));
                                    }
                                })
                            }
                    })
                }
            }
        }
    })
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