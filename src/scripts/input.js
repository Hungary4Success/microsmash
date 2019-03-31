// import "./external/dap.bundle.js"; // Start

import DAPjs from "./external/dap.bundle.js"; // Build

// const { DAPLink } = DAPjs; // Start

export const UserAction = Object.freeze({
  RIGHT: 0,
  LEFT: 1,
  JUMP: 2,
  ATTACK: 3,
  DEFENSE: 4
});

let connectedControllerIds = [];
let activePlayers = 0;

export class Controller {
  constructor(device) {
    this.device = device;
    this.actionHandlers = {};
    this.isExecuting = false;

    // Keyboard controls (for debugging)
    let keyToAction;
    if (activePlayers++ === 0) {
      keyToAction = Object.freeze({
        w: UserAction.JUMP,
        a: UserAction.LEFT,
        s: UserAction.DEFENSE,
        d: UserAction.RIGHT,
        " ": UserAction.ATTACK
      });
    } else {
      keyToAction = Object.freeze({
        i: UserAction.JUMP,
        j: UserAction.LEFT,
        k: UserAction.DEFENSE,
        l: UserAction.RIGHT,
        m: UserAction.ATTACK
      });
    }

    window.addEventListener("keydown", ({ key }) => {
      const action = keyToAction[key];

      if (typeof this.actionHandlers[action] === "function") {
        this.actionHandlers[action]();
      }
    });

    this.handleDataReceive = this.handleDataReceive.bind(this);
  }

  async connectAsync() {
    let currentDAPLink;
    try {
      const usbDevice = new DAPjs.WebUSB(this.device);
      currentDAPLink = new DAPLink(usbDevice);

      await currentDAPLink.connect();
      await currentDAPLink.setSerialBaudrate(115200);
      await currentDAPLink.getSerialBaudrate();
      await currentDAPLink.startSerialRead(50);
    } catch (_) {
      console.error("Error: Connection failed or cancelled.");
    }

    currentDAPLink.on(DAPLink.EVENT_SERIAL_DATA, this.handleDataReceive);

    const connectedElements = document.getElementById("connectedPlayers").children;
    if (connectedControllerIds.length <= 2) {
      connectedElements[connectedControllerIds.length - 1].style = "display: block;";
    }
  }

  addActionListener(action, handler) {
    if (typeof action !== "number" || action >= Object.keys(UserAction).length) {
      throw new Error("Action type is invalid. Use a type from UserAction enum.");
    }

    this.actionHandlers[action] = handler;
  }

  handleDataReceive(data) {
    const lines = data.split(";").filter(command => command !== "");

    lines.forEach((line) => {
      console.log(line);
      const parameters = line.split(",");

      const deviceIdRegExp = new RegExp(/\d+/);
      if (deviceIdRegExp.test(parameters[0]) && parameters.length > 1) {
        if (typeof this.actionHandlers[UserAction[parameters[1]]] === "function") {
          this.actionHandlers[UserAction[parameters[1]]](parameters[2]);
        }
        // const deviceId = parseInt(deviceIdRegExp.exec(parameters[0])[0], 10);

        // if (commandQueues[deviceId] === undefined) {
        //   commandQueues[deviceId] = [];
        // }

        // commandQueues[deviceId].push({
        //   actionString: parameters[1],
        //   actionParameter: parameters[2]
        // });
      }
    });

    // this.executeCommandQueue();
  }

  // executeCommandQueue() {
  //   if (this.isExecuting) {
  //     return;
  //   }

  //   this.isExecuting = true;

  //   let nonEmptyQueues = Object.entries(commandQueues);
  //   do {
  //     for (let i = 0; i < nonEmptyQueues.length; i++) {
  //       const currentCommand = commandQueues[nonEmptyQueues[i][0]].shift();

  //       if (currentCommand !== undefined) {
  //         this.executeCommand(UserAction[currentCommand.actionString]);
  //       }
  //     }

  //     nonEmptyQueues = Object.entries(commandQueues).filter(queue => queue[1].length > 0);
  //   } while (nonEmptyQueues.length > 0);

  //   this.isExecuting = false;
  // }
}

watchControllers();

// Exported variables
// const commandQueues = {};

let onControllerAdded;
let onControllerRemoved;
export function addControllerObserver(addHandler, removeHandler) {
  if (addHandler) {
    onControllerAdded = addHandler;
  }

  if (removeHandler) {
    onControllerRemoved = removeHandler;
  }
}

async function watchControllers() {
  const devices = (await navigator.usb.getDevices()).filter(device => device.vendorId === 3368);
  const deviceIds = devices.map(device => device.serialNumber);

  const addedControllers = deviceIds.filter(device => !connectedControllerIds.includes(device));
  addedControllers.forEach((deviceId) => {
    if (onControllerAdded) {
      connectedControllerIds.push(deviceId);

      const addedDevice = devices.filter(device => device.serialNumber === deviceId)[0];
      onControllerAdded(new Controller(addedDevice));
    }
  });

  const removedControllers = connectedControllerIds.filter(device => !deviceIds.includes(device));
  removedControllers.forEach((deviceId) => {
    if (onControllerRemoved) {
      const removedDeviceId = connectedControllerIds
        .filter(controllerId => controllerId === deviceId)[0];

      connectedControllerIds = connectedControllerIds
        .filter(controllerId => controllerId !== deviceId);
      onControllerRemoved(removedDeviceId);
    }
  });

  setTimeout(watchControllers, 1000);
}
