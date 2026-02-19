import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: '@user_profile',
  DAILY_LOGS: '@daily_logs',
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
