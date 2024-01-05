import { combineReducers } from 'redux'
import { projectsReducer } from './projects/slice'

export const rootReducer = combineReducers({
  // Add reducers here
  Projects: projectsReducer,
})
