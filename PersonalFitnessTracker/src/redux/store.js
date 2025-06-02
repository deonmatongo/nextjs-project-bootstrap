import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import workoutsReducer from './slices/workoutsSlice';
import goalsReducer from './slices/goalsSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    goals: goalsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
