import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload 
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload 
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure } = userSlice.actions

export default userSlice.reducer