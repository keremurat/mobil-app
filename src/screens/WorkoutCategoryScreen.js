import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { workoutDatabase } from '../data/workoutDatabase';

const WorkoutCategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const workouts = workoutDatabase.filter(w => w.category === category);

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.header}>{category}</Text>
        <Text style={styles.subheader}>{workouts.length} egzersiz mevcut</Text>
      </Card>

      {workouts.map((workout) => (
        <TouchableOpacity
          key={workout.id}
          onPress={() => navigation.navigate('WorkoutDetail', { workout })}
        >
          <Card style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="fitness" size={32} color={COLORS.primary} />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDescription} numberOfLines={2}>
                  {workout.description}
                </Text>
              </View>
            </View>

            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.statText}>{workout.duration} dk</Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.statText}>{workout.caloriesBurned} kcal</Text>
              </View>

              {workout.sets && (
                <View style={styles.statItem}>
                  <Ionicons name="repeat-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.statText}>
                    {workout.sets} set {workout.reps && `× ${workout.reps}`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subheader: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  workoutCard: {
    position: 'relative',
  },
  workoutHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 0,
  },
});

export default WorkoutCategoryScreen;
