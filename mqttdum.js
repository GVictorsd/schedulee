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
    console.log('Connected to the Broker');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('hello');

// publish message 'Hello' to topic 'my/test/topic'
//client.publish('my/test/topic', 'Hello');