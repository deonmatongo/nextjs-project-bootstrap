import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, HelperText, RadioButton, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addWorkout, editWorkout, saveWorkouts } from '../redux/slices/workoutsSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import uuid from 'react-native-uuid';

const workoutTypes = ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Other'];

export default function AddEditWorkoutScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { workoutId } = route.params || {};
  const workouts = useSelector(state => state.workouts.items);
  const existingWorkout = workouts.find(w => w.id === workoutId);

  const [name, setName] = useState(existingWorkout ? existingWorkout.name : '');
  const [duration, setDuration] = useState(existingWorkout ? String(existingWorkout.duration) : '');
  const [date, setDate] = useState(existingWorkout ? new Date(existingWorkout.date) : new Date());
  const [type, setType] = useState(existingWorkout ? existingWorkout.type : workoutTypes[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!duration || isNaN(duration) || Number(duration) <= 0) newErrors.duration = 'Duration must be a positive number';
    if (!type) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = () => {
    if (!validate()) return;

    const workoutData = {
      id: existingWorkout ? existingWorkout.id : uuid.v4(),
      name: name.trim(),
      duration: Number(duration),
      date: date.toISOString(),
      type,
    };

    if (existingWorkout) {
      dispatch(editWorkout(workoutData));
    } else {
      dispatch(addWorkout(workoutData));
    }
    dispatch(saveWorkouts([...workouts.filter(w => w.id !== workoutData.id), workoutData]));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Workout Name"
        value={name}
        onChangeText={setName}
        error={!!errors.name}
        mode="outlined"
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <TextInput
        label="Duration (minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        error={!!errors.duration}
        mode="outlined"
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.duration}>
        {errors.duration}
      </HelperText>

      <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.input}>
        Select Date: {date.toDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Workout Type</Text>
      <RadioButton.Group onValueChange={setType} value={type}>
        {workoutTypes.map((wt) => (
          <View key={wt} style={styles.radioRow}>
            <RadioButton value={wt} />
            <Text>{wt}</Text>
          </View>
        ))}
      </RadioButton.Group>
      <HelperText type="error" visible={!!errors.type}>
        {errors.type}
      </HelperText>

      <Button mode="contained" onPress={onSave} style={styles.saveButton}>
        Save Workout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { marginBottom: 8 },
  label: { marginTop: 16, marginBottom: 8, fontWeight: 'bold' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  saveButton: { marginTop: 24 },
});
