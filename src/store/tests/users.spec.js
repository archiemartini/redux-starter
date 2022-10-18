import { userAdded } from "../users";
import configureStore from '../store'

describe('usersSlice', () => {

  let store;

  beforeEach(() => {
    store = configureStore()
  })

  //Helpers
  const usersSlice = () => store.getState().entities
  
  it('it should add a project to the store', () => {
    store.dispatch(userAdded({ name: "User"}))

    expect(usersSlice().users).toHaveLength(1)
  })

})