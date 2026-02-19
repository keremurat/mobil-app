import React, { useState, useEffect, useCallback } from 'react';
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
import { ProgressBar } from '../components/ProgressBar';
import { getUserProfile, getDailyLog, getDateString } from '../utils/storage';

const HomeScreen = () => {
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  const loadData = async () => {
    const userProfile = await getUserProfile();
    const today = getDateString();
    const log = await getDailyLog(today);

    setProfile(userProfile);
    setDailyLog(log);

    // Calculate total calories
    const caloriesFromMeals = log.meals.reduce((sum, meal) => sum + meal.calories, 0);
    setTotalCalories(caloriesFromMeals);
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

  const getMotivationMessage = () => {
    const messages = [
      '🎯 Hedeflerine ulaşmak için harika gidiyorsun!',
      '💪 Her gün biraz daha güçleniyorsun!',
      '🌟 Sağlıklı yaşam için doğru yoldasın!',
      '🔥 Başarı senin için kaçınılmaz!',
      '✨ Küçük adımlar büyük değişimlere yol açar!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const formatDate = () => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const today = new Date();
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  };

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="person-circle-outline" size={80} color={COLORS.gray} />
        <Text style={styles.emptyText}>Profil bilgilerinizi tamamlayın</Text>
        <Text style={styles.emptySubtext}>
          Profil sekmesinden bilgilerinizi girerek başlayın
        </Text>
      </View>
    );
  }

  const calorieGoal = profile.dailyCalorieGoal || 2000;
  const waterGoal = profile.dailyWaterGoal || 8;
  const stepsGoal = 10000;
  const workoutGoal = 30; // minutes

  const totalWorkoutMinutes = dailyLog?.workouts.reduce((sum, w) => sum + w.duration, 0) || 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba, {profile.name}! 👋</Text>
          <Text style={styles.date}>{formatDate()}</Text>
        </View>
      </View>

      <Card style={styles.motivationCard} gradient>
        <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Günlük Hedefler</Text>

        <ProgressBar
          label="Kalori"
          current={totalCalories}
          target={calorieGoal}
          unit="kcal"
          color={COLORS.primary}
        />

        <ProgressBar
          label="Su"
          current={dailyLog?.water || 0}
          target={waterGoal}
          unit="bardak"
          color={COLORS.success}
        />

        <ProgressBar
          label="Adım"
          current={dailyLog?.steps || 0}
          target={stepsGoal}
          unit="adım"
          color={COLORS.warning}
        />

        <ProgressBar
          label="Egzersiz"
          current={totalWorkoutMinutes}
          target={workoutGoal}
          unit="dakika"
          color={COLORS.danger}
        />
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bugünün Özeti</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Ionicons name="restaurant" size={24} color={COLORS.primary} />
            <Text style={styles.summaryValue}>{dailyLog?.meals.length || 0}</Text>
            <Text style={styles.summaryLabel}>Öğün</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="water" size={24} color={COLORS.success} />
            <Text style={styles.summaryValue}>{dailyLog?.water || 0}</Text>
            <Text style={styles.summaryLabel}>Bardak Su</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="fitness" size={24} color={COLORS.danger} />
            <Text style={styles.summaryValue}>{dailyLog?.workouts.length || 0}</Text>
            <Text style={styles.summaryLabel}>Egzersiz</Text>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="flame" size={24} color={COLORS.warning} />
            <Text style={styles.summaryValue}>{totalCalories}</Text>
            <Text style={styles.summaryLabel}>Kalori</Text>
          </View>
        </View>
      </Card>

      {dailyLog?.meals.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Son Öğünler</Text>
          {dailyLog.meals.slice(-3).reverse().map((meal, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{meal.name}</Text>
                <Text style={styles.activitySubtitle}>
                  {meal.mealType} • {meal.calories} kcal
                </Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      {dailyLog?.workouts.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Son Egzersizler</Text>
          {dailyLog.workouts.slice(-3).reverse().map((workout, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="fitness-outline" size={20} color={COLORS.danger} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{workout.name}</Text>
                <Text style={styles.activitySubtitle}>
                  {workout.duration} dk • {workout.caloriesBurned} kcal yakıldı
                </Text>
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
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  date: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  motivationCard: {
    marginHorizontal: 20,
    borderWidth: 0,
  },
  motivationText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 6,
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
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  activitySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
