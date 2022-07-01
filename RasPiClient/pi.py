import RPi.GPIO as gpio

gpio.setwarnings(False)
gpio.setmode(gpio.BOARD)

def initPins(pins):
	print('initialising pins...')
	print(pins)
	for pin in pins:
		gpio.setup(pin, gpio.OUT, initial = gpio.LOW)

def setState(pin, state):
	print('setting pins...')
	print(pin, state)
	# gpio.output(pin, gpio.HIGH if state else gpio.LOW)

