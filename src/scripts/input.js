// Exported variables
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
const keyToAction = Object.freeze({
  w: UserAction.JUMP,
  a: UserAction.LEFT,
  s: UserAction.DEFENSE,
  d: UserAction.RIGHT,
  " ": UserAction.ATTACK
});

const handlers = {};

window.addEventListener("keydown", ({ key }) => {
  const action = keyToAction[key];

  if (typeof handlers[action] === "function") {
    handlers[action]();
  }
});
