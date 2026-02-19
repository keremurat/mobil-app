import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { workoutCategories } from '../data/workoutDatabase';
import { getDailyLog, getDateString, getWeekDates } from '../utils/storage';

const WorkoutScreen = ({ navigation }) => {
  const [dailyLog, setDailyLog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [weekData, setWeekData] = useState([]);

  const loadData = async () => {
    const today = getDateString();
    const log = await getDailyLog(today);
    setDailyLog(log);

    // Load week data
    const dates = getWeekDates();
    const weekLogs = await Promise.all(dates.map(date => getDailyLog(date)));
    const weekWorkouts = weekLogs.map(log =>
      log.workouts.reduce((sum, w) => sum + w.duration, 0)
    );
    setWeekData(weekWorkouts);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalWorkoutTime = dailyLog?.workouts.reduce((sum, w) => sum + w.duration, 0) || 0;
  const totalCaloriesBurned = dailyLog?.workouts.reduce((sum, w) => sum + w.caloriesBurned, 0) || 0;
  const totalWorkouts = dailyLog?.workouts.length || 0;

  const categoryIcons = {
    'Sabah Egzersizleri': { icon: 'sunny', color: COLORS.warning },
    'Yoga': { icon: 'leaf', color: COLORS.success },
    'Ev Sporu': { icon: 'home', color: COLORS.primary },
    "İş'te Spor": { icon: 'briefcase', color: COLORS.textLight },
    'Bedensel Engelliler İçin Spor': { icon: 'accessibility', color: COLORS.danger },
    'Görme Engelliler İçin Spor': { icon: 'eye-off', color: COLORS.accent4 },
  };

  const maxWeekMinutes = Math.max(...weekData, 60);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Card>
        <Text style={styles.sectionTitle}>Bugünün Egzersiz Özeti</Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Ionicons name="time" size={32} color={COLORS.primary} />
            <Text style={styles.summaryValue}>{totalWorkoutTime}</Text>
            <Text style={styles.summaryLabel}>Dakika</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="flame" size={32} color={COLORS.danger} />
            <Text style={styles.summaryValue}>{totalCaloriesBurned}</Text>
            <Text style={styles.summaryLabel}>Kalori Yakıldı</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="fitness" size={32} color={COLORS.success} />
            <Text style={styles.summaryValue}>{totalWorkouts}</Text>
            <Text style={styles.summaryLabel}>Egzersiz</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Haftalık Egzersiz Grafiği</Text>
        <View style={styles.chart}>
          {weekData.map((minutes, index) => {
            const height = maxWeekMinutes > 0 ? (minutes / maxWeekMinutes) * 120 : 0;
            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
            const today = new Date().getDay();
            const dayIndex = (today - 1 + index) % 7;

            return (
              <View key={index} style={styles.chartBar}>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: Math.max(height, 5),
                        backgroundColor: index === 6 ? COLORS.primary : COLORS.textLight
                      }
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{days[dayIndex]}</Text>
                <Text style={styles.chartValue}>{minutes}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Egzersiz Kategorileri</Text>

        {workoutCategories.map((category, index) => {
          const categoryInfo = categoryIcons[category];
          return (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('WorkoutCategory', { category })}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons
                  name={categoryInfo.icon}
                  size={28}
                  color={categoryInfo.color}
                />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          );
        })}
      </Card>

      {dailyLog?.workouts.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Bugünkü Egzersizler</Text>
          {dailyLog.workouts.map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutIcon}>
                <Ionicons name="fitness" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.workoutContent}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDetails}>
                  {workout.duration} dk • {workout.caloriesBurned} kcal
                </Text>
                {workout.sets && (
                  <Text style={styles.workoutSets}>
                    {workout.sets} set {workout.reps && `× ${workout.reps} tekrar`}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </Card>
      )}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 4,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 4,
  },
  chartValue: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  workoutItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  workoutDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  workoutSets: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
});

export default WorkoutScreen;
