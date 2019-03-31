from microbit import *
import random

controllerId = random.randint(10000, 99999)
previousTilt = 0
lastSentTilt = ""

while True:
    tilt = accelerometer.get_x()

    # Tilting:
    if tilt > 400 or tilt < -400:
        if tilt > previousTilt + 100 and lastSentTilt != "R":
            display.show("R")
            print(str(controllerId) + ",RIGHT," + str(tilt) + ";", flush=True)
            lastSentTilt = "R"
        elif tilt < previousTilt - 100 and lastSentTilt != "L":
            display.show("L")
            print(str(controllerId) + ",LEFT," + str(tilt) + ";", flush=True)
            lastSentTilt = "L"
    elif (tilt > previousTilt + 100 or tilt < previousTilt - 100) and lastSentTilt != "M":
        print(str(controllerId) + ",RIGHT," + "0" + ";", flush=True)
        display.show(Image.NO)
        lastSentTilt = "M"

    # Buttons
    if button_a.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        print(str(controllerId) + ",JUMP;", flush=True)
    if button_b.is_pressed():
        display.show(Image.PITCHFORK)
        print(str(controllerId) + ",ATTACK;", flush=True)

    previousTilt = tilt

    sleep(200)
