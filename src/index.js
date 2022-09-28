import configureStore from './store/store'
import { projectAdded } from "./store/projects"
import { assignBugToUser, addBug, loadBugs, resolveBug, bugAdded, bugResolved, bugAssignedToUser, getUnresolvedBugs, getBugsByUser } from "./store/bugs"
import { userAdded } from './store/users'
import * as actions from './store/api'

const store = configureStore()

store.subscribe(() => {
  console.log("Store changed!", store.getState())
})


store.dispatch(loadBugs())

setTimeout(() => store.dispatch(assignBugToUser(1, 3)), 2000)
// setTimeout(() => store.dispatch(loadBugs()), 2000)

// store.dispatch((dispatch, getState) => {
//   dispatch({ type: 'bugsReceived', bugs: [1, 2, 3]})
//   console.log(getState())
// })

// store.dispatch({
//   type: "error",
//   payload: { message: "An error occured." }
// })

// store.dispatch(userAdded({ name: 'Archie'}))
// store.dispatch(userAdded({ name: 'Joe' }))

// store.dispatch(projectAdded({name: "Project 1"}))

// store.dispatch(bugAdded({ description: "Bug 1" }))
// store.dispatch(bugAdded({ description: "Bug 2" }))
// store.dispatch(bugAdded({ description: "Bug 3" }))
// store.dispatch(bugResolved({ id: 1 }))

// store.dispatch(bugAssignedToUser({ userId: 2, bugId: 2}))

// const userBugs = getBugsByUser(2)(store.getState())

// console.log(userBugs)

// const unresolvedBugs = getUnresolvedBugs(store.getState())
