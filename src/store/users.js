import { createAction, createSlice } from "@reduxjs/toolkit";



// Slice

let lastId = 0

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    userAdded: (state, action) => {
      state.push({
        id: ++lastId,
        name: action.payload.name
      })
    }
  }
})

// Action creators
export const { userAdded, bugAssigned} = slice.actions

//export the reducer

export default slice.reducer