import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { calculateBMR, calculateDailyCalories, calculateMacros } from '../utils/calculations';
import { Picker } from '@react-native-picker/picker';

const BMRCalculatorScreen = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('erkek');
  const [activityLevel, setActivityLevel] = useState('sedanter');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    if (!w || !h || !a) {
      return;
    }

    const bmr = calculateBMR(w, h, a, gender);
    const dailyCalories = calculateDailyCalories(bmr, activityLevel);
    const macros = calculateMacros(dailyCalories);

    setResult({
      bmr: Math.round(bmr),
      dailyCalories,
      macros,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>BMR Hesaplama</Text>
        <Text style={styles.description}>
          Bazal Metabolizma Hızınızı (BMR) ve günlük kalori ihtiyacınızı hesaplayın.
        </Text>

        <Input
          label="Kilo (kg)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="Örn: 70"
        />

        <Input
          label="Boy (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
          placeholder="Örn: 175"
        />

        <Input
          label="Yaş"
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

        <Button
          title="Hesapla"
          onPress={handleCalculate}
          style={{ marginTop: 16 }}
        />
      </Card>

      {result && (
        <>
          <Card>
            <Text style={styles.resultTitle}>Sonuçlar</Text>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Bazal Metabolizma Hızı (BMR)</Text>
              <Text style={styles.resultValue}>{result.bmr} kcal/gün</Text>
              <Text style={styles.resultDescription}>
                Vücudunuzun dinlenme halinde yaktığı kalori miktarı
              </Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Günlük Kalori İhtiyacı</Text>
              <Text style={styles.resultValue}>{result.dailyCalories} kcal/gün</Text>
              <Text style={styles.resultDescription}>
                Aktivite seviyenize göre günlük kalori ihtiyacınız
              </Text>
            </View>
          </Card>

          <Card>
            <Text style={styles.resultTitle}>Önerilen Makro Besin Dağılımı</Text>

            <View style={styles.macroGrid}>
              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>{result.macros.protein}g</Text>
                <Text style={styles.macroPercentage}>30%</Text>
              </View>

              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Karbonhidrat</Text>
                <Text style={styles.macroValue}>{result.macros.carbs}g</Text>
                <Text style={styles.macroPercentage}>40%</Text>
              </View>

              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Yağ</Text>
                <Text style={styles.macroValue}>{result.macros.fat}g</Text>
                <Text style={styles.macroPercentage}>30%</Text>
              </View>
            </View>
          </Card>

          <Card>
            <Text style={styles.infoTitle}>💡 Bilgi</Text>
            <Text style={styles.infoText}>
              • Kilo vermek için günlük {result.dailyCalories - 500} kcal hedefleyin{'\n'}
              • Kilo almak için günlük {result.dailyCalories + 500} kcal hedefleyin{'\n'}
              • Kilonuzu korumak için günlük {result.dailyCalories} kcal hedefleyin
            </Text>
          </Card>
        </>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
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
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  resultLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
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
    marginBottom: 2,
  },
  macroPercentage: {
    fontSize: 12,
    color: COLORS.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
});

export default BMRCalculatorScreen;
