// Exported variables
const commandQueues = {};

const { DAPLink } = DAPjs;
export async function connectToDevice() {
  let currentDAPLink;
  try {
    const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xD28 }] });
    const usbDevice = new DAPjs.WebUSB(device);
    currentDAPLink = new DAPLink(usbDevice);

    await currentDAPLink.connect();
    await currentDAPLink.setSerialBaudrate(115200);
    await currentDAPLink.getSerialBaudrate();
    await currentDAPLink.startSerialRead(50);
  } catch (_) {
    console.error("Error: Connection failed or cancelled.");
  }

  currentDAPLink.on(DAPLink.EVENT_SERIAL_DATA, (data) => {
    const lines = data.split(";").filter(command => command !== "");

    lines.forEach((line) => {
      const parameters = line.split(",");

      const deviceIdRegExp = new RegExp(/\d+/);
      if (deviceIdRegExp.test(parameters[0]) && parameters.length > 1) {
        const deviceId = parseInt(deviceIdRegExp.exec(parameters[0])[0], 10);

        if (commandQueues[deviceId] === undefined) {
          commandQueues[deviceId] = [];
        }

        commandQueues[deviceId].push({
          actionString: parameters[1],
          actionParameter: parameters[2]
        });
      }
    });

    executeCommandQueue();
  });
}

export const UserAction = Object.freeze({
  RIGHT: 0,
  LEFT: 1,
  JUMP: 2,
  ATTACK: 3,
  DEFENSE: 4
});

export function registerHandler(action, handler) {
  if (typeof action !== "number" || action >= Object.keys(UserAction).length) {
    throw new Error("Action type is invalid. Use a type from UserAction enum.");
  }

  handlers[action] = handler;
}

// Local variables
const handlers = {};

let isExecuting = false;
function executeCommandQueue() {
  if (isExecuting) {
    return;
  }

  isExecuting = true;

  let nonEmptyQueues;
  do {
    nonEmptyQueues = Object.entries(commandQueues).filter(queue => queue.length > 0);

    console.log(nonEmptyQueues);

    for (let i = 0; i < nonEmptyQueues; i++) {
      const currentCommand = nonEmptyQueues[i].shift();
      executeCommand(UserAction[currentCommand.actionString]);
    }
  } while (nonEmptyQueues.length > 0);

  isExecuting = false;
}

function executeCommand(action) {
  if (typeof handlers[action] === "function") {
    handlers[action]();
  }
}

// Keyboard controls (for debugging)
const keyToAction = Object.freeze({
  w: UserAction.JUMP,
  a: UserAction.LEFT,
  s: UserAction.DEFENSE,
  d: UserAction.RIGHT,
  " ": UserAction.ATTACK
});

window.addEventListener("keydown", ({ key }) => {
  executeCommand(keyToAction[key]);
});
