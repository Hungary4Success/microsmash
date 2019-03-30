from microbit import *

while True:
    # Tilting:
    tilt = accelerometer.get_x()
    if tilt > 400:
        display.show("R")
    elif tilt < -400:
        display.show("L")

    # Jumping
    height = accelerometer.get_z()
    if height > 0:
        display.show(Image.ARROW_N)

    # Buttons
    if button_a.is_pressed():
        display.show(Image.PITCHFORK)
    elif button_b.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
