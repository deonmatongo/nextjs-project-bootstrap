import React, { useEffect } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FAB, List, ActivityIndicator, Colors } from 'react-native-paper';
import { loadWorkouts, deleteWorkout, saveWorkouts } from '../redux/slices/workoutsSlice';

export default function WorkoutsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.workouts);

  useEffect(() => {
    dispatch(loadWorkouts());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      dispatch(saveWorkouts(items));
    }
  }, [items, loading, dispatch]);

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteWorkout(id)) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`${item.type} - ${item.duration} mins`}
      onPress={() => navigation.navigate('AddEditWorkout', { workoutId: item.id })}
      onLongPress={() => confirmDelete(item.id)}
      left={props => <List.Icon {...props} icon="dumbbell" />}
    />
  );

  if (loading) {
    return <ActivityIndicator animating={true} color={Colors.blue500} style={styles.loading} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <List.Subheader>Error loading workouts: {error}</List.Subheader>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={items.length === 0 && styles.center}
        ListEmptyComponent={<List.Subheader>No workouts found. Add some!</List.Subheader>}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddEditWorkout')}
        label="Add Workout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
