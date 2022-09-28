import { addBug } from '../bugs'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import configureStore from '../store'

describe('bugSlice', () => {
  
  describe('Bugs Action Creators', () => {

    let fakeAxios;
    let fakeStore;

    beforeEach(() => {
      fakeAxios = new MockAdapter(axios)
      fakeStore = configureStore()
    })

    const bugsSlice = () => fakeStore.getState().entities.bugs

    it('should add the bug to the store if it\'s saved to the server', async () => {
      //Arrange - create the sort of object expected from a successful call to the api, i.e. savedBug, THEN mock the http request
      const bug = { description: 'a' }
      const savedBug = { ...bug, id: 1}
      fakeAxios.onPost('/bugs').reply(200, savedBug)
      //Act
      await fakeStore.dispatch(addBug(bug))
      //Assert
      expect(bugsSlice().list).toContainEqual(savedBug)
    })
    
    it('should not add the bug to the store if it\'s not saved to the server', async () => {
      const bug = { description: 'a' }
      const savedBug = { ...bug, id: 1}
      //change 200 to 500 to replicate a server error
      fakeAxios.onPost('/bugs').reply(500)
    
      await fakeStore.dispatch(addBug(bug))
    
      expect(bugsSlice().list).toHaveLength(0)
    })
  })

})