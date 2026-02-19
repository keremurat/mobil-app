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
import { ProgressRing } from '../components/ProgressRing';
import {
  getUserProfile,
  getDailyLog,
  getDateString,
  getEngagementStats,
  getWeeklyProgressReport,
} from '../utils/storage';

const HomeScreen = () => {
  const [profile, setProfile] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [engagement, setEngagement] = useState(null);
  const [weeklyReport, setWeeklyReport] = useState(null);

  const loadData = async () => {
    const userProfile = await getUserProfile();
    const today = getDateString();
    const log = await getDailyLog(today);
    const stats = await getEngagementStats(userProfile);
    const report = await getWeeklyProgressReport(userProfile);

    setProfile(userProfile);
    setDailyLog(log);
    setEngagement(stats);
    setWeeklyReport(report);

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

  const getSmartSuggestion = () => {
    if (!profile || !dailyLog) return 'Güne güçlü başlamak için ilk öğününü ekle.';

    const goalCalories = profile.dailyCalorieGoal || 2000;
    const waterGoal = profile.dailyWaterGoal || 8;
    const workoutMinutes = dailyLog.workouts.reduce((sum, workout) => sum + workout.duration, 0);

    if (dailyLog.meals.length === 0) return 'Bugün hiç öğün eklemedin. Kahvaltı ile başla.';
    if (totalCalories < goalCalories * 0.5) return 'Kalori hedefinin yarısının altındasın, dengeli bir öğün ekleyebilirsin.';
    if ((dailyLog.water || 0) < waterGoal * 0.5) return 'Su hedefinin yarısına henüz ulaşmadın. Şimdi 1 bardak su içebilirsin.';
    if (workoutMinutes === 0) return 'Bugün hareket zamanı. 10-15 dakikalık kısa bir egzersiz ekleyebilirsin.';

    return 'Harika gidiyorsun. Bugünü aynı tempoda tamamla ve serini koru.';
  };

  const getShortDayLabel = (dateString) => {
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return dayNames[new Date(`${dateString}T00:00:00`).getDay()];
  };

  const unlockedBadges = engagement?.unlockedBadges || [];

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
  const calorieProgress = Math.min(totalCalories / calorieGoal, 1);
  const waterProgress = Math.min((dailyLog?.water || 0) / waterGoal, 1);
  const workoutProgress = Math.min(totalWorkoutMinutes / workoutGoal, 1);
  const maxWeeklyCalories = Math.max(...(weeklyReport?.dailyCalories || [0]), calorieGoal, 1);

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
        <View style={styles.streakHeader}>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={20} color={COLORS.warning} />
            <Text style={styles.streakValue}>{engagement?.currentStreak || 0} gün seri</Text>
          </View>
          <Text style={styles.streakMeta}>Bu hafta aktif gün: {engagement?.activeDaysThisWeek || 0}/7</Text>
        </View>

        {unlockedBadges.length > 0 ? (
          <View style={styles.badgeRow}>
            {unlockedBadges.slice(0, 3).map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Ionicons name={badge.icon} size={16} color={badge.color} />
                <Text style={styles.badgeText}>{badge.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noBadgeText}>Rozet kazanmak için ilk öğününü veya egzersizini kaydet.</Text>
        )}
      </Card>

      <Card>
        <View style={styles.suggestionHeader}>
          <Ionicons name="sparkles" size={18} color={COLORS.accent1} />
          <Text style={styles.suggestionTitle}>Akıllı Öneri</Text>
        </View>
        <Text style={styles.suggestionText}>{getSmartSuggestion()}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Bugün Görsel Durum</Text>
        <View style={styles.ringRow}>
          <View style={styles.ringItem}>
            <ProgressRing
              progress={calorieProgress}
              size={84}
              strokeWidth={8}
              color={COLORS.primary}
              value={`${Math.round(calorieProgress * 100)}%`}
              label="Kalori"
            />
          </View>
          <View style={styles.ringItem}>
            <ProgressRing
              progress={waterProgress}
              size={84}
              strokeWidth={8}
              color={COLORS.success}
              value={`${Math.round(waterProgress * 100)}%`}
              label="Su"
            />
          </View>
          <View style={styles.ringItem}>
            <ProgressRing
              progress={workoutProgress}
              size={84}
              strokeWidth={8}
              color={COLORS.warning}
              value={`${Math.round(workoutProgress * 100)}%`}
              label="Egzersiz"
            />
          </View>
        </View>
      </Card>

      {weeklyReport && (
        <Card>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>Haftalık Performans</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreValue}>{weeklyReport.consistencyScore}</Text>
              <Text style={styles.scoreUnit}>/100</Text>
            </View>
          </View>

          <View style={styles.weeklyChartRow}>
            {weeklyReport.weekDates.map((date, index) => {
              const calories = weeklyReport.dailyCalories[index] || 0;
              const barHeight = (calories / maxWeeklyCalories) * 90;
              return (
                <View key={date} style={styles.weeklyChartItem}>
                  <View style={styles.weeklyChartTrack}>
                    <View
                      style={[
                        styles.weeklyChartBar,
                        {
                          height: Math.max(barHeight, 4),
                          backgroundColor: index === weeklyReport.weekDates.length - 1 ? COLORS.primary : COLORS.accent4,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.weeklyChartLabel}>{getShortDayLabel(date)}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.metricProgressBlock}>
            <View style={styles.metricProgressRow}>
              <View style={styles.metricProgressHead}>
                <Text style={styles.metricProgressLabel}>Takip Günleri</Text>
                <Text style={styles.metricProgressValue}>{weeklyReport.trackedDays}/7</Text>
              </View>
              <View style={styles.metricTrack}>
                <View
                  style={[
                    styles.metricFill,
                    {
                      width: `${(weeklyReport.trackedDays / 7) * 100}%`,
                      backgroundColor: COLORS.info,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricProgressRow}>
              <View style={styles.metricProgressHead}>
                <Text style={styles.metricProgressLabel}>Kalori Hedefi</Text>
                <Text style={styles.metricProgressValue}>{weeklyReport.calorieGoalDays}/7</Text>
              </View>
              <View style={styles.metricTrack}>
                <View
                  style={[
                    styles.metricFill,
                    {
                      width: `${(weeklyReport.calorieGoalDays / 7) * 100}%`,
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricProgressRow}>
              <View style={styles.metricProgressHead}>
                <Text style={styles.metricProgressLabel}>Egzersiz Günü</Text>
                <Text style={styles.metricProgressValue}>{weeklyReport.workoutDays}/7</Text>
              </View>
              <View style={styles.metricTrack}>
                <View
                  style={[
                    styles.metricFill,
                    {
                      width: `${(weeklyReport.workoutDays / 7) * 100}%`,
                      backgroundColor: COLORS.success,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.metricProgressRow}>
              <View style={styles.metricProgressHead}>
                <Text style={styles.metricProgressLabel}>Su Hedefi</Text>
                <Text style={styles.metricProgressValue}>{weeklyReport.waterGoalDays}/7</Text>
              </View>
              <View style={styles.metricTrack}>
                <View
                  style={[
                    styles.metricFill,
                    {
                      width: `${(weeklyReport.waterGoalDays / 7) * 100}%`,
                      backgroundColor: COLORS.warning,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <Text style={styles.weeklyInsight}>{weeklyReport.insight}</Text>
        </Card>
      )}

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
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  streakValue: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  streakMeta: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  noBadgeText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  ringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ringItem: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 24,
  },
  scoreUnit: {
    marginLeft: 3,
    fontSize: 12,
    color: COLORS.textLight,
  },
  weeklyChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 14,
  },
  weeklyChartItem: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyChartTrack: {
    width: '72%',
    height: 92,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  weeklyChartBar: {
    width: '100%',
    borderRadius: 8,
  },
  weeklyChartLabel: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.textLight,
  },
  metricProgressBlock: {
    marginTop: 6,
    gap: 10,
  },
  metricProgressRow: {
    gap: 6,
  },
  metricProgressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricProgressLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  metricProgressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricTrack: {
    width: '100%',
    height: 8,
    borderRadius: 6,
    backgroundColor: COLORS.cardSecondary,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 6,
  },
  weeklyInsight: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
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
