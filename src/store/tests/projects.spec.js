import { projectAdded } from "../projects";
import configureStore from '../store'

describe('projectsSlice', () => {

  let store;

  beforeEach(() => {
    store = configureStore()
  })

  //Helpers
  const projectsSlice = () => store.getState().entities
  
  it('it should add a project to the store', () => {
    store.dispatch(projectAdded({ name: "Project 1"}))

    expect(projectsSlice().projects).toHaveLength(1)
  })

})