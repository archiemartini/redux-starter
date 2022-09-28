import { createAction, createReducer } from "@reduxjs/toolkit";

export const projectAdded = createAction("projectAdded")

let lastId = 0

export default createReducer([], {
  projectAdded: (state, action) => {
    state.push({
      id: ++lastId,
      name: action.payload.name
    })
  }
})