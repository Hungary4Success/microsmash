from microbit import *
import random

controllerId = random.randint(1, 99999)

while True:
    tilt = accelerometer.get_x()
    height = accelerometer.get_z()

    # Jumping
    if height > 0:
        display.show(Image.ARROW_N)
        print(str(controllerId) + ",jump;", flush=True)
    # Tilting:
    elif tilt > 400:
        display.show("R")
        print(str(controllerId) + ",right_tilt," + str(tilt) + ";", flush=True)
    elif tilt < -400:
        display.show("L")
        print(str(controllerId) + ",left_tilt," + str(tilt) + ";", flush=True)
    # Buttons
    elif button_a.is_pressed():
        display.show(Image.PITCHFORK)
        print(str(controllerId) + ",attack;", flush=True)
    elif button_b.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        print(str(controllerId) + ",defend;", flush=True)

    sleep(100)
