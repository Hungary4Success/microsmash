from microbit import *
import random

controllerId = random.randint(1, 99999)

while True:
    tilt = accelerometer.get_x()
    height = accelerometer.get_z()

    # Jumping
    if height > 0:
        display.show(Image.ARROW_N)
        print(str(controllerId) + ",JUMP;", flush=True)
    # Tilting:
    elif tilt > 400:
        display.show("R")
        print(str(controllerId) + ",RIGHT," + str(tilt) + ";", flush=True)
    elif tilt < -400:
        display.show("L")
        print(str(controllerId) + ",LEFT," + str(tilt) + ";", flush=True)
    # Buttons
    elif button_a.is_pressed():
        display.show(Image.PITCHFORK)
        print(str(controllerId) + ",ATTACK;", flush=True)
    elif button_b.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        print(str(controllerId) + ",DEFENSE;", flush=True)

    sleep(200)
