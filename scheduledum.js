const schedule = require('node-schedule');

function setSchedule(time){
    schedule.scheduleJob(date, function(){
        console.log('Reminder at 12:14');
    });
}

var date = new Date(2022, 4, 22, 12, 26, 30);
setSchedule(date);
console.log('returned for call 1');

date = new Date(2022, 4, 22, 12, 26, 45);
setSchedule(date);
console.log('returned from call 2')

// var job = schedule.scheduleJob(date, function(){
//     console.log('Reminder at 12:14');
// });