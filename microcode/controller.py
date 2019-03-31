from microbit import *
import random


class Queue:
    def __init__(self):
        self.items = []

    def isEmpty(self):
        return self.items == []

    def enqueue(self, item):
        self.items.insert(0, item)

    def dequeue(self):
        return self.items.pop()

    def size(self):
        return len(self.items)

    def getPriority(self):
        i = 0
        while i < len(self.items):
            if self.items[i] == str(controllerId) + ",JUMP;":
                self.items.remove(str(controllerId) + ",JUMP;")
                print(str(controllerId) + ",JUMP;")
                return True
            elif self.items[i] == str(controllerId) + ",ATTACK;":
                self.items.remove(str(controllerId) + ",ATTACK;")
                print(str(controllerId) + ",ATTACK;")
                return True

            i += 1
        return False


controllerId = random.randint(10000, 99999)
previousTilt = 0
lastSentTilt = ""

queue = Queue()

while True:
    tilt = accelerometer.get_x()

    # Tilting:
    if tilt > 400 or tilt < -400:
        if tilt > previousTilt + 100 and lastSentTilt != "R":
            display.show("R")
            queue.enqueue(str(controllerId) + ",RIGHT," + str(tilt) + ";")
            # print(str(controllerId) + ",RIGHT," + str(tilt) + ";", flush=True)
            lastSentTilt = "R"
        elif tilt < previousTilt - 100 and lastSentTilt != "L":
            display.show("L")
            queue.enqueue(str(controllerId) + ",LEFT," + str(tilt) + ";")
            # print(str(controllerId) + ",LEFT," + str(tilt) + ";", flush=True)
            lastSentTilt = "L"
    elif (tilt > previousTilt + 100 or tilt < previousTilt - 100) and lastSentTilt != "M":
        queue.enqueue(str(controllerId) + ",RIGHT," + "0" + ";")
        # print(str(controllerId) + ",RIGHT," + "0" + ";", flush=True)
        display.show(Image.NO)
        lastSentTilt = "M"

    # Buttons
    if button_a.is_pressed():
        display.show(Image.TRIANGLE_LEFT)
        queue.enqueue(str(controllerId) + ",JUMP;")
        # print(str(controllerId) + ",JUMP;", flush=True)
    if button_b.is_pressed():
        display.show(Image.PITCHFORK)
        queue.enqueue(str(controllerId) + ",ATTACK;")
        # print(str(controllerId) + ",ATTACK;", flush=True)

    previousTilt = tilt

    while queue.getPriority():
        sleep(100)

    while not queue.isEmpty():
        print(queue.dequeue())
        sleep(100)
