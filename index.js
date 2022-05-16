
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


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/pst', (req, res) => {
    console.log('request received');
    console.log(req.body);
});

app.get('/gt', (req, res) => {
    var msg = {'hello' : 'world'};
    console.log('Get received');
    res.send(JSON.stringify(msg));
})


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
            }
        })
}
function CreateT2(){
    db.run(`
        CREATE TABLE T2 (
            uid INTEGER PRIMARY KEY AUTOINCREMENT,
            uname VARCHAR(255) NOT NULL,
            previlage INTEGER NOT NULL
        )`, (err) => {
            if(err){
                console.log(err);
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