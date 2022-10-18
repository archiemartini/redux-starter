import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import {createSelector} from 'reselect'
import { apiCallBegan } from "./api";
import moment from "moment";
import axios from "axios";

// Action creators

export const bugAdded = createAction("bugAdded")
export const bugResolved = createAction("bugResolved")
export const bugAssignedToUser = createAction("bugAssignedToUser")

//bug request actions
export const bugsRequested = createAction("bugsRequested")
export const bugsReceived = createAction("bugsReceived")
export const bugsRequestFailed = createAction("bugsRequestFailed")


//a holdall action creator function for the actions above
const url = "/bugs"
export const loadBugs = () => (dispatch, getState) => {
  const {lastFetch} = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')
  if (diffInMinutes < 10) return;

  return dispatch(apiCallBegan({
    url,
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestFailed.type
  }))
}

// COMMAND actions, as opposed to Event actions, (addBug === Command Action) && (bugAdded === Event Action)
export const addBug = bug => apiCallBegan({
  url,
  method: "post",
  data: bug,
  onSuccess: bugAdded.type
})

export const resolveBug = id => apiCallBegan({
  url: url + '/' + id,
  method: 'PATCH',
  data: { resolved: true },
  onSuccess: bugResolved.type
})

export const assignBugToUser = (bugId, userId) => apiCallBegan({
  url: url + '/' + bugId,
  method: 'patch',
  data: { userId },
  onSuccess: bugAssignedToUser.type
})



//Selectors
///// export const getUnresolvedBugs = state => {
/////   return state.entities.bugs.filter(bug => !bug.resolved)
///// }

//Memoization ^^ nullifies above as if you were to call bugUpdated twice it would create two different but identical objects
//bugs => get inresolved bugs from the cache
//memoization on the other hand creates a cache of the object, the first time it's called, if no change it just returns a cache

export const getUnresolvedBugs = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter(bug => !bug.resolved)
)

export const getBugsByUser = (userId) => createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter(bug => bug.userId === userId)
)

// Reducers

let lastId = 0

export default createReducer({list: [], loading: false, lastFetch: null}, {
  // key: value
  // or
  // actions: functions
  bugAdded: (state, action) => {
    state.list.push(action.payload)
  },
  bugResolved: (state, action) => {
    const index = state.list.findIndex(bug => bug.id === action.payload.id)
    state.list[index].resolved = true
  }, 
  bugAssignedToUser: (state, action) => {
    const { id: bugId, userId} = action.payload
    const index = state.list.findIndex(bug => bug.id === bugId);
    state.list[index].userId = userId
  },
  bugsReceived: (bugs, action) => {
   bugs.list = action.payload
   bugs.loading = false
   bugs.lastFetch = Date.now()
  },
  bugsRequested: (bugs, action) => {
    bugs.loading = true;
  },
  bugsRequestFailed: (bugs, action) => {
    bugs.loading = false
  },
  //no need for default with ReduxToolkit
})



//OLD FASHION WAY

// export default function reducer(state = [], action) {
  //   switch (action.type) {
    //     case bugAdded.type:
    //       return [
      //         ...state,
      //         {
        //           id: ++lastId,
        //           description: action.payload.description,
        //           resolved: false
        //         }
        //       ]
        //     case bugRemoved.type:
        //       return state.filter(bug => bug.id !== action.payload.id)
        //     case bugResolved.type:
        //       return state.map(bug => bug.id !== action.payload.id ? bug : {...bug, resolved: true})
        //     default:
        //       return state
        //   }
        
        //SLICE WAY
        
        //a slice will create both the action and reducer at the same time
        // const slice = createSlice({
        //   name: 'bugs',
        //   initialState: [],
        //   reducers: {
        //     // actions => action handlers
        //     bugAdded: (state,action) => {
        //       state.push({
        //         id: ++lastId,
        //         description: action.payload.description,
        //         resolved: false
        //       })
        //     },
            
        //     bugResolved: (state, action) => {
        //       const index = state.findIndex(bug => bug.id === action.payload.id)
        //       state[index].resolved = true
        //     },
        
        //   }
        // })
        // if we were exporting the slice we would do...
        
        /////// export default slice.reducer //////
        
        // and if we wanter to export the actions we would use object destructuring...
        /////// export const { bugAdded, bugResolved } = slice.actions //////
