import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteStart: (state) => {
            state.loading = true;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null
        },
        deleteFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        signOutStart: (state) => {
            state.loading = true;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null
        },
        signOutFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        [REHYDRATE] : (state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null
        }
    }
})


export const {
     signInStart, 
    signInFailure, 
    signInSuccess, 
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteStart, 
    deleteSuccess, 
    deleteFailure,
    signOutStart, 
    signOutFailure, 
    signOutSuccess, 
} = userSlice.actions;

export default userSlice.reducer