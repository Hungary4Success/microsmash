from microbit import *

while True:
    # Tilting:
    tilt = accelerometer.get_x()
    if tilt > 400:
        display.show("R")
        print("right_tilt: " + str(tilt))
    elif tilt < -400:
        display.show("L")
        print("left_tilt: " + str(tilt))

    # Jumping
    height = accelerometer.get_z()
    if height > 0:
        display.show(Image.ARROW_N)
        print("jump")

    # Buttons
    if button_a.is_pressed():
        display.show(Image.PITCHFORK)
        print("attack")
    elif button_b.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        print("defend")

    sleep(100)
