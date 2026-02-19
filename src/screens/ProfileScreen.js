import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { getUserProfile, saveUserProfile, clearAllData } from '../utils/storage';
import {
  calculateBMR,
  calculateDailyCalories,
  adjustCaloriesForGoal,
  calculateBMI,
  getBMICategory,
  getIdealWeightRange,
  calculateWaterNeeds,
} from '../utils/calculations';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('erkek');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedanter');
  const [goal, setGoal] = useState('kilo koru');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    const userProfile = await getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      setName(userProfile.name || '');
      setAge(String(userProfile.age || ''));
      setGender(userProfile.gender || 'erkek');
      setHeight(String(userProfile.height || ''));
      setWeight(String(userProfile.weight || ''));
      setActivityLevel(userProfile.activityLevel || 'sedanter');
      setGoal(userProfile.goal || 'kilo koru');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleSave = async () => {
    if (!name || !age || !height || !weight) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);

    try {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      const a = parseInt(age);

      const bmr = calculateBMR(w, h, a, gender);
      const dailyCaloriesBase = calculateDailyCalories(bmr, activityLevel);
      const dailyCalorieGoal = adjustCaloriesForGoal(dailyCaloriesBase, goal);
      const dailyWaterGoal = calculateWaterNeeds(w);

      const profileData = {
        name,
        age: a,
        gender,
        height: h,
        weight: w,
        activityLevel,
        goal,
        dailyCalorieGoal,
        dailyWaterGoal,
        bmr: Math.round(bmr),
      };

      await saveUserProfile(profileData);
      setProfile(profileData);
      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz kaydedildi!');
    } catch (error) {
      Alert.alert('Hata', 'Profil kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Tüm verileriniz silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setProfile(null);
            setName('');
            setAge('');
            setHeight('');
            setWeight('');
            setIsEditing(true);
            Alert.alert('Başarılı', 'Tüm veriler silindi.');
          },
        },
      ]
    );
  };

  const renderStats = () => {
    if (!profile) return null;

    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(parseFloat(bmi));
    const idealWeight = getIdealWeightRange(profile.height);

    return (
      <>
        <Card>
          <Text style={styles.sectionTitle}>Hesaplanan Değerler</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>BMR (Bazal Metabolizma)</Text>
            <Text style={styles.statValue}>{profile.bmr} kcal/gün</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Günlük Kalori Hedefi</Text>
            <Text style={styles.statValue}>{profile.dailyCalorieGoal} kcal</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Günlük Su Hedefi</Text>
            <Text style={styles.statValue}>{profile.dailyWaterGoal} bardak</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Vücut Kitle İndeksi (BMI)</Text>

          <View style={styles.bmiContainer}>
            <View style={styles.bmiCircle}>
              <Text style={styles.bmiValue}>{bmi}</Text>
              <Text style={styles.bmiCategory}>{bmiCategory}</Text>
            </View>

            <View style={styles.bmiInfo}>
              <Text style={styles.bmiInfoText}>
                BMI değeriniz {bmi} olarak hesaplandı.
              </Text>
              <Text style={styles.bmiInfoText}>
                Kategori: <Text style={styles.bold}>{bmiCategory}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.bmiScale}>
            <View style={[styles.bmiScaleItem, { backgroundColor: '#90CAF9' }]}>
              <Text style={styles.bmiScaleText}>{'<18.5'}</Text>
              <Text style={styles.bmiScaleLabel}>Zayıf</Text>
            </View>
            <View style={[styles.bmiScaleItem, { backgroundColor: '#66BB6A' }]}>
              <Text style={styles.bmiScaleText}>18.5-25</Text>
              <Text style={styles.bmiScaleLabel}>Normal</Text>
            </View>
            <View style={[styles.bmiScaleItem, { backgroundColor: '#FFA726' }]}>
              <Text style={styles.bmiScaleText}>25-30</Text>
              <Text style={styles.bmiScaleLabel}>Fazla</Text>
            </View>
            <View style={[styles.bmiScaleItem, { backgroundColor: '#EF5350' }]}>
              <Text style={styles.bmiScaleText}>{'>30'}</Text>
              <Text style={styles.bmiScaleLabel}>Obez</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>İdeal Kilo Aralığı</Text>
          <Text style={styles.idealWeightText}>
            Boyunuz ({profile.height} cm) için ideal kilo aralığı:
          </Text>
          <Text style={styles.idealWeightRange}>
            {idealWeight.min} - {idealWeight.max} kg
          </Text>
          <Text style={styles.currentWeightText}>
            Mevcut kilonuz: <Text style={styles.bold}>{profile.weight} kg</Text>
          </Text>
        </Card>
      </>
    );
  };

  if (isEditing) {
    return (
      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.title}>Profil Bilgileri</Text>
          <Text style={styles.subtitle}>
            Kişisel bilgilerinizi girerek size özel kalori ve besin hesaplamaları elde edin.
          </Text>

          <Input
            label="Adınız *"
            value={name}
            onChangeText={setName}
            placeholder="Örn: Ahmet"
          />

          <Input
            label="Yaş *"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="Örn: 30"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Cinsiyet</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={styles.picker}
              >
                <Picker.Item label="Erkek" value="erkek" />
                <Picker.Item label="Kadın" value="kadın" />
              </Picker>
            </View>
          </View>

          <Input
            label="Boy (cm) *"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            placeholder="Örn: 175"
          />

          <Input
            label="Kilo (kg) *"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="Örn: 70"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Aktivite Seviyesi</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={activityLevel}
                onValueChange={setActivityLevel}
                style={styles.picker}
              >
                <Picker.Item label="Sedanter (Hareketsiz)" value="sedanter" />
                <Picker.Item label="Hafif Aktif (Haftada 1-3 gün)" value="hafif aktif" />
                <Picker.Item label="Aktif (Haftada 3-5 gün)" value="aktif" />
                <Picker.Item label="Çok Aktif (Haftada 6-7 gün)" value="çok aktif" />
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Hedefiniz</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={goal}
                onValueChange={setGoal}
                style={styles.picker}
              >
                <Picker.Item label="Kilo Ver" value="kilo ver" />
                <Picker.Item label="Kilo Koru" value="kilo koru" />
                <Picker.Item label="Kilo Al" value="kilo al" />
              </Picker>
            </View>
          </View>

          <Button
            title="Kaydet"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 16 }}
          />

          {profile && (
            <Button
              title="İptal"
              onPress={() => {
                loadProfile();
                setIsEditing(false);
              }}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          )}
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name}</Text>
            <Text style={styles.profileDetails}>
              {profile?.age} yaş • {profile?.gender === 'erkek' ? 'Erkek' : 'Kadın'}
            </Text>
            <Text style={styles.profileDetails}>
              {profile?.height} cm • {profile?.weight} kg
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Hedef Bilgileri</Text>
        <View style={styles.goalContainer}>
          <View style={styles.goalItem}>
            <Ionicons name="trending-up" size={24} color={COLORS.primary} />
            <Text style={styles.goalLabel}>Aktivite Seviyesi</Text>
            <Text style={styles.goalValue}>
              {profile?.activityLevel === 'sedanter' && 'Sedanter'}
              {profile?.activityLevel === 'hafif aktif' && 'Hafif Aktif'}
              {profile?.activityLevel === 'aktif' && 'Aktif'}
              {profile?.activityLevel === 'çok aktif' && 'Çok Aktif'}
            </Text>
          </View>

          <View style={styles.goalItem}>
            <Ionicons name="flag" size={24} color={COLORS.success} />
            <Text style={styles.goalLabel}>Hedefiniz</Text>
            <Text style={styles.goalValue}>
              {profile?.goal === 'kilo ver' && 'Kilo Ver'}
              {profile?.goal === 'kilo koru' && 'Kilo Koru'}
              {profile?.goal === 'kilo al' && 'Kilo Al'}
            </Text>
          </View>
        </View>
      </Card>

      {renderStats()}

      <Card>
        <Button
          title="Profili Düzenle"
          onPress={() => setIsEditing(true)}
          variant="secondary"
        />
        <Button
          title="Tüm Verileri Sıfırla"
          onPress={handleClearData}
          variant="outline"
          style={{ marginTop: 12 }}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: COLORS.cardSecondary,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalItem: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  goalLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bmiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bmiCategory: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 4,
  },
  bmiInfo: {
    flex: 1,
  },
  bmiInfoText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  bmiScale: {
    flexDirection: 'row',
    marginTop: 8,
  },
  bmiScaleItem: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  bmiScaleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  bmiScaleLabel: {
    fontSize: 9,
    color: COLORS.white,
    marginTop: 2,
  },
  idealWeightText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  idealWeightRange: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 12,
  },
  currentWeightText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default ProfileScreen;
