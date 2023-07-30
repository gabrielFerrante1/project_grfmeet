import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import meetingReducer from './reducers/meetingReducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        meeting: meetingReducer
    },
});

export type RootState = ReturnType<typeof store.getState>; 