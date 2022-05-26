/************************************************************************
 * --- CLIENT.JS ---
 * Module to receive messages from the broker sent by the server
 * mimics the behaviour of a client hosting network of actuators

*************************************************************************/

var mqtt = require('mqtt')

var options = {
    host: '15ebb79b7e324144a12afa463b2a68e6.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'vicping',
    password: '@B2b2b2b2'
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected to the Broker...');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    // console.log('Received message:', topic, message.toString());
    var msg = message.toString();
    msg = JSON.parse(msg);
    console.log('------ Schedule No: ' + msg.scheduleNo + '-----------------------------------')
    console.log(`Room No: ${msg.roomNo}`);
    console.log(`UserId: ${msg.uid}`);
    var from = new Date(msg.timefrom).toString();
    console.log(`From: ${from}`);
    var to = new Date(msg.timeto).toString();
    console.log(`To: ${to}`);
    console.log(`Devices: ${msg.devices}`);

    console.log('----------------------------------------------------------')
});

// subscribe to topic 'my/test/topic'
client.subscribe('schedule');

// publish message 'Hello' to topic 'my/test/topic'
//client.publish('my/test/topic', 'Hello');