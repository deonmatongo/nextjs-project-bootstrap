import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUTS_STORAGE_KEY = 'workouts';

export const loadWorkouts = createAsyncThunk(
  'workouts/loadWorkouts',
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveWorkouts = createAsyncThunk(
  'workouts/saveWorkouts',
  async (workouts, { rejectWithValue }) => {
    try {
      const jsonValue = JSON.stringify(workouts);
      await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, jsonValue);
      return workouts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addWorkout(state, action) {
      state.items.push(action.payload);
    },
    editWorkout(state, action) {
      const index = state.items.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteWorkout(state, action) {
      state.items = state.items.filter(w => w.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWorkouts.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addWorkout, editWorkout, deleteWorkout } = workoutsSlice.actions;

export default workoutsSlice.reducer;
