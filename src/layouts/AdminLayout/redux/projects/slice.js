import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  project: [],
  selectedProjectId: [],
  isLoading: false,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, { payload }) => {
      const index = state.project.findIndex((value) => {
        value.projectId === payload.projectId
      })
      index !== -1
        ? (state.project = state.project.filter((value) => {
            value.projectId !== payload.projectId
          }))
        : (state.project = [...state.project, payload])
    },
    setProjectId: (state, { payload }) => {
      state.selectedProjectId = payload
    },
    clearProjectId: (state) => {
      state.selectedProjectId = null
    },
  },
})

export const { reducer: projectsReducer, actions: projectsActions } =
  projectsSlice
