import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectId: {},
  isLoading: false,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjectId: (state, action) => {
      state.projectId = action.payload
    },
  },
})

export const { reducer: projectsReducer } = projectsSlice
export const { setProjectId } = projectsSlice.actions
