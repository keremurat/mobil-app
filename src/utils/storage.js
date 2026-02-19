import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

const STORAGE_KEYS = {
  USER_PROFILE: '@user_profile',
  DAILY_LOGS: '@daily_logs',
  RECENT_MEALS: '@recent_meals',
};

// User Profile
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Daily Logs
export const saveDailyLog = async (date, log) => {
  try {
    const logs = await getAllDailyLogs();
    logs[date] = log;
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error('Error saving daily log:', error);
    return false;
  }
};

export const getDailyLog = async (date) => {
  try {
    const logs = await getAllDailyLogs();
    return logs[date] || {
      date,
      meals: [],
      workouts: [],
      water: 0,
      steps: 0,
    };
  } catch (error) {
    console.error('Error getting daily log:', error);
    return {
      date,
      meals: [],
      workouts: [],
      water: 0,
      steps: 0,
    };
  }
};

export const getAllDailyLogs = async () => {
  try {
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return logs ? JSON.parse(logs) : {};
  } catch (error) {
    console.error('Error getting all daily logs:', error);
    return {};
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export const getWeekDates = () => {
  const today = new Date();
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(getDateString(date));
  }
  return dates;
};

export const saveRecentMeal = async (meal) => {
  try {
    const recentMeals = await getRecentMeals();
    const normalizedMeal = {
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      amount: meal.amount,
      unit: meal.unit,
    };

    const dedupedMeals = recentMeals.filter(
      (item) => !(item.name === normalizedMeal.name && item.unit === normalizedMeal.unit)
    );

    const updatedMeals = [normalizedMeal, ...dedupedMeals].slice(0, 8);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_MEALS, JSON.stringify(updatedMeals));
    return true;
  } catch (error) {
    console.error('Error saving recent meal:', error);
    return false;
  }
};

export const getRecentMeals = async () => {
  try {
    const recentMeals = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_MEALS);
    return recentMeals ? JSON.parse(recentMeals) : [];
  } catch (error) {
    console.error('Error getting recent meals:', error);
    return [];
  }
};

const toDate = (dateString) => new Date(`${dateString}T00:00:00`);

const isActiveLog = (log) => {
  const meals = log?.meals?.length || 0;
  const workouts = log?.workouts?.length || 0;
  return meals > 0 || workouts > 0;
};

const calculateCurrentStreak = (sortedDates, logs) => {
  const today = getDateString();
  let streak = 0;
  let expectedDate = today;

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const date = sortedDates[i];
    if (date !== expectedDate) {
      break;
    }

    if (!isActiveLog(logs[date])) {
      break;
    }

    streak += 1;

    const previousDate = new Date(toDate(expectedDate));
    previousDate.setDate(previousDate.getDate() - 1);
    expectedDate = getDateString(previousDate);
  }

  return streak;
};

export const getEngagementStats = async (profile = null) => {
  try {
    const logs = await getAllDailyLogs();
    const dates = Object.keys(logs).sort((a, b) => toDate(a) - toDate(b));

    const activeDates = dates.filter((date) => isActiveLog(logs[date]));
    const totalActiveDays = activeDates.length;
    const currentStreak = calculateCurrentStreak(dates, logs);

    const weekDates = getWeekDates();
    const activeDaysThisWeek = weekDates.filter((date) => isActiveLog(logs[date])).length;

    const totalMeals = activeDates.reduce((sum, date) => sum + (logs[date]?.meals?.length || 0), 0);
    const totalWorkouts = activeDates.reduce((sum, date) => sum + (logs[date]?.workouts?.length || 0), 0);

    const today = getDateString();
    const todayLog = logs[today] || { meals: [], workouts: [] };
    const todayCalories = todayLog.meals.reduce((sum, meal) => sum + meal.calories, 0);
    const todayGoal = profile?.dailyCalorieGoal || 2000;
    const inGoalRangeToday = todayCalories > 0 && todayCalories >= todayGoal * 0.85 && todayCalories <= todayGoal * 1.1;

    const badges = [
      {
        id: 'first_meal',
        title: 'İlk Öğün',
        icon: 'restaurant',
        color: COLORS.warning,
        unlocked: totalMeals > 0,
      },
      {
        id: 'first_workout',
        title: 'İlk Egzersiz',
        icon: 'fitness',
        color: COLORS.danger,
        unlocked: totalWorkouts > 0,
      },
      {
        id: 'streak_3',
        title: '3 Gün Seri',
        icon: 'flame',
        color: COLORS.primary,
        unlocked: currentStreak >= 3,
      },
      {
        id: 'streak_7',
        title: '7 Gün Seri',
        icon: 'trophy',
        color: COLORS.accent1,
        unlocked: currentStreak >= 7,
      },
      {
        id: 'goal_keeper',
        title: 'Hedef Koruyucu',
        icon: 'checkmark-circle',
        color: COLORS.success,
        unlocked: inGoalRangeToday,
      },
    ];

    return {
      currentStreak,
      totalActiveDays,
      activeDaysThisWeek,
      totalMeals,
      totalWorkouts,
      badges,
      unlockedBadges: badges.filter((badge) => badge.unlocked),
    };
  } catch (error) {
    console.error('Error getting engagement stats:', error);
    return {
      currentStreak: 0,
      totalActiveDays: 0,
      activeDaysThisWeek: 0,
      totalMeals: 0,
      totalWorkouts: 0,
      badges: [],
      unlockedBadges: [],
    };
  }
};

export const getWeeklyProgressReport = async (profile = null) => {
  try {
    const logs = await getAllDailyLogs();
    const weekDates = getWeekDates();
    const weekLogs = weekDates.map((date) => logs[date] || { meals: [], workouts: [], water: 0, steps: 0 });

    const goalCalories = profile?.dailyCalorieGoal || 2000;
    const waterGoal = profile?.dailyWaterGoal || 8;

    const dailyCalories = weekLogs.map((log) => log.meals.reduce((sum, meal) => sum + meal.calories, 0));
    const dailyWorkoutMinutes = weekLogs.map((log) => log.workouts.reduce((sum, workout) => sum + workout.duration, 0));

    const trackedDays = weekLogs.filter((log) => isActiveLog(log)).length;
    const workoutDays = dailyWorkoutMinutes.filter((minutes) => minutes > 0).length;
    const waterGoalDays = weekLogs.filter((log) => (log.water || 0) >= waterGoal).length;
    const calorieGoalDays = dailyCalories.filter(
      (calories) => calories >= goalCalories * 0.85 && calories <= goalCalories * 1.1
    ).length;

    const totalCalories = dailyCalories.reduce((sum, value) => sum + value, 0);
    const totalWorkoutMinutes = dailyWorkoutMinutes.reduce((sum, value) => sum + value, 0);
    const activeCalorieDays = dailyCalories.filter((value) => value > 0).length;

    const avgCalories = activeCalorieDays > 0 ? Math.round(totalCalories / activeCalorieDays) : 0;

    const trackingRate = trackedDays / 7;
    const calorieRate = calorieGoalDays / 7;
    const workoutRate = workoutDays / 7;
    const waterRate = waterGoalDays / 7;

    const consistencyScore = Math.round(
      (trackingRate * 0.35 + calorieRate * 0.35 + workoutRate * 0.2 + waterRate * 0.1) * 100
    );

    let insight = 'Başlangıç iyi, bu hafta biraz daha düzenli kayıtla çok daha iyi sonuç alırsın.';
    if (consistencyScore >= 85) {
      insight = 'Mükemmel bir hafta! Tempoyu koruyorsun ve hedeflerine çok yakınsın.';
    } else if (consistencyScore >= 70) {
      insight = 'Güçlü bir ritim yakaladın. Birkaç gün daha hedefte kalırsan seviye atlayacaksın.';
    } else if (consistencyScore >= 50) {
      insight = 'İyi gidiyorsun. Özellikle su ve egzersiz günlerini artırmak skoru hızla yükseltir.';
    }

    return {
      consistencyScore,
      insight,
      trackedDays,
      calorieGoalDays,
      workoutDays,
      waterGoalDays,
      avgCalories,
      totalWorkoutMinutes,
      dailyCalories,
      dailyWorkoutMinutes,
      weekDates,
    };
  } catch (error) {
    console.error('Error getting weekly progress report:', error);
    return {
      consistencyScore: 0,
      insight: 'Haftalık rapor hazırlanamadı.',
      trackedDays: 0,
      calorieGoalDays: 0,
      workoutDays: 0,
      waterGoalDays: 0,
      avgCalories: 0,
      totalWorkoutMinutes: 0,
      dailyCalories: [0, 0, 0, 0, 0, 0, 0],
      dailyWorkoutMinutes: [0, 0, 0, 0, 0, 0, 0],
      weekDates: getWeekDates(),
    };
  }
};
