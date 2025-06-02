import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS_STORAGE_KEY = 'fitnessGoals';

export const loadGoals = createAsyncThunk(
  'goals/loadGoals',
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : { weeklyGoal: 0, progress: 0 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveGoals = createAsyncThunk(
  'goals/saveGoals',
  async (goals, { rejectWithValue }) => {
    try {
      const jsonValue = JSON.stringify(goals);
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, jsonValue);
      return goals;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    weeklyGoal: 0,
    progress: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setWeeklyGoal(state, action) {
      state.weeklyGoal = action.payload;
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyGoal = action.payload.weeklyGoal;
        state.progress = action.payload.progress;
      })
      .addCase(loadGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveGoals.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setWeeklyGoal, setProgress } = goalsSlice.actions;

export default goalsSlice.reducer;
