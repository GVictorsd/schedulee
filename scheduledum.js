const schedule = require('node-schedule');

function setSchedule(time, a){
    schedule.scheduleJob(time, function(){
        console.log('Reminder at 12:14');
        console.log(a);
    });
}

var date = new Date(2022, 4, 25, 16, 50, 30);
var a = 'hello';
setSchedule(date, a);
console.log('returned for call 1');

a = 'hi';
date = new Date(2022, 4, 25, 16, 50, 45);
setSchedule(date, a);
console.log('returned from call 2')

// var job = schedule.scheduleJob(date, function(){
//     console.log('Reminder at 12:14');
// });