from microbit import *
import random

controllerId = random.randint(1, 99999)
previousTilt = 0
previousHeight = 0

while True:

    tilt = accelerometer.get_x()
    height = accelerometer.get_z()

    # Jumping
    if height > previousHeight + 400:
        display.show(Image.ARROW_N)
        print(str(controllerId) + ",JUMP;", flush=True)
    # Tilting:
    elif tilt > 400 or tilt < -400:
        if tilt > previousTilt + 100:
            display.show("R")
            print(str(controllerId) + ",RIGHT," + str(tilt) + ";", flush=True)
        elif tilt < previousTilt - 100:
            display.show("L")
            print(str(controllerId) + ",LEFT," + str(tilt) + ";", flush=True)
    elif tilt > previousTilt + 100 or tilt < previousTilt - 100:
        print(str(controllerId) + ",RIGHT," + "0" + ";", flush=True)
        display.show(Image.NO)
    # Buttons
    elif button_a.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        print(str(controllerId) + ",DEFENSE;", flush=True)
    if button_b.is_pressed():
        display.show(Image.PITCHFORK)
        print(str(controllerId) + ",ATTACK;", flush=True)

    previousTilt = tilt
    previousHeight = height

    sleep(200)
