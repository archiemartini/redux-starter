import { addBug, resolveBug, loadBugs, getUnresolvedBugs, getBugsByUser, assignBugToUser } from '../bugs'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import configureStore from '../store'
import { add } from 'lodash'

describe('bugSlice', () => {
  
    let fakeAxios;
    let fakeStore;

    beforeEach(() => {
      fakeAxios = new MockAdapter(axios)
      fakeStore = configureStore()
    })

    //Helper functions

    const bugsSlice = () => fakeStore.getState().entities.bugs

    const createState = () => ({
      entities: {
        bugs: {
          list: []
        }
      }
    })

    describe('Loading Bugs', () => {
      describe('if the bugs exist in the cache', () => {
        it('they should not be fetched from the server again', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

          await fakeStore.dispatch(loadBugs())
          await fakeStore.dispatch(loadBugs())

          expect(fakeAxios.history.get.length).toEqual(1)
        })
      })
      describe('if the bugs do not exist in the cache', () => {
        it('they should be fetched from the server and put in the store', async () => {
          fakeAxios.onGet('/bugs').reply(200, [{id: 1}])

          await fakeStore.dispatch(loadBugs())

          expect(bugsSlice().list).toHaveLength(1)
        })
        
        describe('loading idicator', () => {

          it('should be true while fetching the bugs', () => {
            fakeAxios.onGet("/bugs").reply(() => {
              expect(bugsSlice.loading).toBe(true)
              return [200, [{id: 1}]]
            })

            fakeStore.dispatch(loadBugs())
          })
          it('should be false after fetching the bugs', async () => {
            fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }])

            await fakeStore.dispatch(loadBugs())
         
            expect(bugsSlice().loading).toBe(false)
          })
          it('should be false if the server returns an error', async () => {
            fakeAxios.onGet("/bugs").reply(500)

            await fakeStore.dispatch(loadBugs())

            expect(bugsSlice().loading).toBe(false)
          })          
        })

      })
    })

    // ADD BUGS

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

    // RESOLVE BUGS

    it('it should mark a bug as resolved if it is saved to the server', async () => {
      const bug = { description: 'a' }
      const savedBug = { ...bug, id: 1, resolved: false}
      const resolvedBug = { ...savedBug, resolved: true}

      fakeAxios.onPost('/bugs').reply(200, savedBug)
      fakeAxios.onPatch('/bugs/1').reply(200, resolvedBug)

      await fakeStore.dispatch(addBug(bug))
      await fakeStore.dispatch(resolveBug(1))

      expect(bugsSlice().list).toContainEqual(resolvedBug)
    })

    it('it should not mark the bug as resolved if it is not saved to the server', async () => {
      //arrangement above not really necessary
      fakeAxios.onPost('/bugs').reply(200, { id: 1, resolved: false})
      fakeAxios.onPatch('/bugs/1').reply(500)

      await fakeStore.dispatch(addBug({}))
      await fakeStore.dispatch(resolveBug(1))

      expect(bugsSlice().list[0].resolved).not.toBe(true)
    })

    // ASSIGN BUG TO USER

    it('should assign a bug to a given user', async () => {
      fakeAxios.onPost('/bugs').reply(200, { id: 1 })
      fakeAxios.onPatch('/bugs/1').reply(200, { id: 1, userId: 1})

      await fakeStore.dispatch(addBug({}))
      await fakeStore.dispatch(assignBugToUser(1, 1))

      expect(bugsSlice().list[0].userId).toBe(1)
    })

    describe('Selectors', () => {
      
      it('getUnresolvedBugs', () => {
        const state = createState()
        state.entities.bugs.list = [ { id: 1, resolved: true}, { id: 2, resolved: false}, { id: 3, resolved: false} ]
        
        const result = getUnresolvedBugs(state)
        
        expect(result).toHaveLength(2)
      })

      it('getBugsByUser', async () => {
        const state = createState()
        state.entities.bugs.list = [ { id: 1, userId: 2} ]

        const result = getBugsByUser(2)(state)

        expect(result).toHaveLength(1)
      })

    })
})

