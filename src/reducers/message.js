import { SET_MESSAGE, CLEAR_MESSAGE } from "../actions/types";

const initialstate = {};

//export default function message (state = initialstate, action) {
export default function (state = initialstate, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { message: payload };

    case CLEAR_MESSAGE:
      return { message: "" };

    default:
      return state;
  }
}
