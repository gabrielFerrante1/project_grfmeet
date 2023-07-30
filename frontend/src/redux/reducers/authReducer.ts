import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/Auth';

export const slice = createSlice({
    name: 'auth',
    initialState: {
        user: null as AuthUser | null
    },
    reducers: {
        setAuthUser: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload
        }
    }
});


export const {
    setAuthUser
} = slice.actions;

export default slice.reducer;