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
import { Button } from '../components/Button';
import { getUserProfile, getDailyLog, getDateString, getWeekDates } from '../utils/storage';

const CalorieTrackerScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('Kahvaltı');

  const loadData = async () => {
    const userProfile = await getUserProfile();
    const today = getDateString();
    const log = await getDailyLog(today);

    setProfile(userProfile);
    setDailyLog(log);

    // Load week data for chart
    const dates = getWeekDates();
    const weekLogs = await Promise.all(dates.map(date => getDailyLog(date)));
    const weekCalories = weekLogs.map(log =>
      log.meals.reduce((sum, meal) => sum + meal.calories, 0)
    );
    setWeekData(weekCalories);
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

  const getMealsByType = (mealType) => {
    return dailyLog?.meals.filter(meal => meal.mealType === mealType) || [];
  };

  const getCaloriesByType = (mealType) => {
    return getMealsByType(mealType).reduce((sum, meal) => sum + meal.calories, 0);
  };

  const totalCalories = dailyLog?.meals.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  const totalProtein = dailyLog?.meals.reduce((sum, meal) => sum + meal.protein, 0) || 0;
  const totalCarbs = dailyLog?.meals.reduce((sum, meal) => sum + meal.carbs, 0) || 0;
  const totalFat = dailyLog?.meals.reduce((sum, meal) => sum + meal.fat, 0) || 0;

  const calorieGoal = profile?.dailyCalorieGoal || 2000;
  const remaining = calorieGoal - totalCalories;

  const mealTypes = [
    { key: 'Kahvaltı', icon: 'sunny', color: COLORS.warning },
    { key: 'Öğle', icon: 'partly-sunny', color: COLORS.primary },
    { key: 'Akşam', icon: 'moon', color: COLORS.danger },
    { key: 'Ara Öğün', icon: 'nutrition', color: COLORS.success },
  ];

  const selectedMealInfo = mealTypes.find((mealType) => mealType.key === selectedMealType) || mealTypes[0];
  const selectedMeals = getMealsByType(selectedMealType);
  const selectedMealCalories = getCaloriesByType(selectedMealType);

  const maxWeekCalories = Math.max(...weekData, calorieGoal);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Card>
        <Text style={styles.sectionTitle}>Günlük Kalori Özeti</Text>

        <View style={styles.calorieOverview}>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Alınan</Text>
            <Text style={[styles.calorieValue, { color: COLORS.primary }]}>{totalCalories}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          <View style={styles.calorieDivider} />

          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Hedef</Text>
            <Text style={styles.calorieValue}>{calorieGoal}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          <View style={styles.calorieDivider} />

          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Kalan</Text>
            <Text style={[styles.calorieValue, { color: remaining >= 0 ? COLORS.success : COLORS.danger }]}>
              {remaining}
            </Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%`,
                  backgroundColor: totalCalories > calorieGoal ? COLORS.danger : COLORS.primary
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {((totalCalories / calorieGoal) * 100).toFixed(0)}%
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Makro Besinler</Text>
        <View style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{totalProtein.toFixed(0)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Karbonhidrat</Text>
            <Text style={styles.macroValue}>{totalCarbs.toFixed(0)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Yağ</Text>
            <Text style={styles.macroValue}>{totalFat.toFixed(0)}g</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Haftalık Kalori Grafiği</Text>
        <View style={styles.chart}>
          {weekData.map((calories, index) => {
            const height = maxWeekCalories > 0 ? (calories / maxWeekCalories) * 120 : 0;
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
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.chartLegendItem}>
            <View style={[styles.chartLegendColor, { backgroundColor: COLORS.lightGray }]} />
            <Text style={styles.chartLegendText}>Hedef: {calorieGoal} kcal</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Öğün Menüsü</Text>
        <View style={styles.mealTabsContainer}>
          {mealTypes.map((mealType) => {
            const isActive = selectedMealType === mealType.key;
            const mealCount = getMealsByType(mealType.key).length;

            return (
              <TouchableOpacity
                key={mealType.key}
                style={[styles.mealTab, isActive && styles.mealTabActive]}
                onPress={() => setSelectedMealType(mealType.key)}
              >
                <Ionicons
                  name={mealType.icon}
                  size={18}
                  color={isActive ? COLORS.text : mealType.color}
                />
                <Text style={[styles.mealTabText, isActive && styles.mealTabTextActive]}>
                  {mealType.key}
                </Text>
                <Text style={styles.mealTabCount}>{mealCount}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      <Card>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Ionicons name={selectedMealInfo.icon} size={24} color={selectedMealInfo.color} />
            <Text style={styles.mealTitle}>{selectedMealType}</Text>
          </View>
          <Text style={styles.mealCalories}>{selectedMealCalories} kcal</Text>
        </View>

        {selectedMeals.length > 0 ? (
          selectedMeals.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDetails}>
                  {meal.amount} {meal.unit} • P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                </Text>
              </View>
              <Text style={styles.mealItemCalories}>{meal.calories} kcal</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMeal}>Bu öğün için henüz yemek eklenmedi</Text>
        )}

        <Button
          title={`${selectedMealType} için Yemek Ekle`}
          onPress={() => navigation.navigate('AddMeal', { mealType: selectedMealType })}
          variant="secondary"
          size="small"
          style={{ marginTop: 12 }}
        />
      </Card>

      <Card>
        <Button
          title="BMR Hesapla"
          onPress={() => navigation.navigate('BMRCalculator')}
          variant="outline"
        />
      </Card>

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
  calorieOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  calorieItem: {
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  calorieUnit: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  calorieDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 50,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
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
  chartLegend: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  chartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  chartLegendText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  mealTabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTab: {
    minWidth: '47%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.cardSecondary,
  },
  mealTabActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.infoLight,
  },
  mealTabText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  mealTabTextActive: {
    color: COLORS.text,
  },
  mealTabCount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealDetails: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  mealItemCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyMeal: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
});

export default CalorieTrackerScreen;
