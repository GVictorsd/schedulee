import time
import paho.mqtt.client as paho
from paho import mqtt
import json

# userdefined libraries
from pi import *


# Device name to pin mapping...
devicePinMap = {
	"D1" : 40,
	"D2" : 38
}


# -------- MQTT CallBack Functions --------

def on_connect(client, userdata, flags, rc, properties=None):
#    print("CONNACK received with code %s." % rc)
    print('Connected to Broker')

def on_publish(client, userdata, mid, properties=None):
    print("mid: " + str(mid))

def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_message(client, userdata, msg):
#    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    message = json.loads(msg.payload)
    devices = message["devices"].split(',')
    pins = [devicePinMap[i] for i in devices]
    initPins(pins)
    for pin in pins:
        setState(pin, 1)
    # TODO: get json and switch on appropriate pin on the board


client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect

# enable TLS for secure connection
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
client.username_pw_set("vicping", "@B2b2b2b2")
client.connect("15ebb79b7e324144a12afa463b2a68e6.s1.eu.hivemq.cloud", 8883)

client.on_subscribe = on_subscribe
client.on_message = on_message
client.on_publish = on_publish

# subscribe to all topics of encyclopedia by using the wildcard "#"
client.subscribe("schedule", qos=1)

# client.publish("hi", payload="hello world!", qos=1)


client.loop_forever()
