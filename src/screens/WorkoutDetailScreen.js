import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getDailyLog, saveDailyLog, getDateString, getUserProfile } from '../utils/storage';

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { workout } = route.params;
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workout.duration * 60); // Convert to seconds
  const [currentSet, setCurrentSet] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            Alert.alert('Tebrikler!', 'Egzersizi tamamladınız! 🎉');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(workout.duration * 60);
    setCurrentSet(1);
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const today = getDateString();
      const dailyLog = await getDailyLog(today);
      const profile = await getUserProfile();

      // Calculate actual calories burned based on user weight if available
      let caloriesBurned = workout.caloriesBurned;
      if (profile?.weight) {
        const durationInMinutes = workout.duration;
        const MET = 6; // Moderate intensity
        caloriesBurned = Math.round((MET * profile.weight * durationInMinutes) / 60);
      }

      const workoutData = {
        id: Date.now(),
        name: workout.name,
        category: workout.category,
        duration: workout.duration,
        caloriesBurned,
        sets: workout.sets || null,
        reps: workout.reps || null,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      dailyLog.workouts.push(workoutData);
      await saveDailyLog(today, dailyLog);

      Alert.alert(
        'Tebrikler! 🎉',
        `Egzersiz tamamlandı!\n${caloriesBurned} kcal yaktınız.`,
        [
          { text: 'Tamam', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Egzersiz kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextSet = () => {
    if (currentSet < workout.sets) {
      setCurrentSet(currentSet + 1);
      Alert.alert('Set Tamamlandı', `${currentSet}. set tamamlandı! Sonraki set: ${currentSet + 1}`);
    } else {
      Alert.alert('Tebrikler!', 'Tüm setleri tamamladınız! 💪');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.category}>{workout.category}</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{workout.description}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Egzersiz Bilgileri</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={32} color={COLORS.primary} />
            <Text style={styles.infoValue}>{workout.duration}</Text>
            <Text style={styles.infoLabel}>Dakika</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="flame" size={32} color={COLORS.danger} />
            <Text style={styles.infoValue}>{workout.caloriesBurned}</Text>
            <Text style={styles.infoLabel}>Kalori</Text>
          </View>

          {workout.sets && (
            <View style={styles.infoItem}>
              <Ionicons name="repeat" size={32} color={COLORS.success} />
              <Text style={styles.infoValue}>{workout.sets}</Text>
              <Text style={styles.infoLabel}>Set</Text>
            </View>
          )}

          {workout.reps && (
            <View style={styles.infoItem}>
              <Ionicons name="fitness-outline" size={32} color={COLORS.warning} />
              <Text style={styles.infoValue}>{workout.reps}</Text>
              <Text style={styles.infoLabel}>Tekrar</Text>
            </View>
          )}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Zamanlayıcı</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <View style={styles.progressCircle}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(timeLeft / (workout.duration * 60)) * 100}%`,
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.timerButtons}>
          <Button
            title={isActive ? 'Duraklat' : 'Başlat'}
            onPress={handleStartPause}
            variant="primary"
            style={styles.timerButton}
          />
          <Button
            title="Sıfırla"
            onPress={handleReset}
            variant="outline"
            style={styles.timerButton}
          />
        </View>

        {workout.sets && (
          <Card style={styles.setTracker}>
            <Text style={styles.setTrackerTitle}>Set Takibi</Text>
            <View style={styles.setTrackerContent}>
              <Text style={styles.currentSetText}>
                {currentSet} / {workout.sets}
              </Text>
              {currentSet < workout.sets && (
                <Button
                  title="Set Tamamlandı"
                  onPress={handleNextSet}
                  variant="secondary"
                  size="small"
                />
              )}
            </View>
          </Card>
        )}
      </Card>

      <Card>
        <Button
          title="Egzersizi Tamamla ve Kaydet"
          onPress={handleComplete}
          loading={loading}
          variant="primary"
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
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 6,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  progressCircle: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timerButton: {
    flex: 1,
  },
  setTracker: {
    marginTop: 16,
    backgroundColor: COLORS.background,
  },
  setTrackerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  setTrackerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentSetText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default WorkoutDetailScreen;
