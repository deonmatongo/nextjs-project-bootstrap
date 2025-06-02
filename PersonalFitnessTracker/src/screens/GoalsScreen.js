import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TextInput, Button, ProgressBar, Colors, HelperText } from 'react-native-paper';
import { loadGoals, saveGoals, setWeeklyGoal, setProgress } from '../redux/slices/goalsSlice';

export default function GoalsScreen() {
  const dispatch = useDispatch();
  const { weeklyGoal, progress, loading, error } = useSelector(state => state.goals);
  const [goalInput, setGoalInput] = useState(String(weeklyGoal));
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    dispatch(loadGoals());
  }, [dispatch]);

  useEffect(() => {
    setGoalInput(String(weeklyGoal));
  }, [weeklyGoal]);

  const validateAndSave = () => {
    const numGoal = Number(goalInput);
    if (isNaN(numGoal) || numGoal <= 0) {
      setInputError('Please enter a positive number');
      return;
    }
    setInputError('');
    dispatch(setWeeklyGoal(numGoal));
    dispatch(saveGoals({ weeklyGoal: numGoal, progress }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Weekly Fitness Goal (minutes)</Text>
      <TextInput
        label="Weekly Goal"
        value={goalInput}
        onChangeText={setGoalInput}
        keyboardType="numeric"
        mode="outlined"
        error={!!inputError}
        style={styles.input}
      />
      <HelperText type="error" visible={!!inputError}>
        {inputError}
      </HelperText>
      <Button mode="contained" onPress={validateAndSave} disabled={loading} style={styles.button}>
        Save Goal
      </Button>

      <Text style={styles.progressText}>Progress: {progress} / {weeklyGoal} minutes</Text>
      <ProgressBar progress={weeklyGoal > 0 ? progress / weeklyGoal : 0} color={Colors.blue500} style={styles.progressBar} />

      {error ? <Text style={styles.errorText}>Error: {error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 8 },
  button: { marginBottom: 24 },
  progressText: { fontSize: 16, marginBottom: 8 },
  progressBar: { height: 10, borderRadius: 5 },
  errorText: { color: 'red', marginTop: 8 },
});
