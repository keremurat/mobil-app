import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { foodDatabase } from '../data/foodDatabase';
import { getDailyLog, saveDailyLog, getDateString } from '../utils/storage';

const AddMealScreen = ({ route, navigation }) => {
  const { mealType } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateNutrients = (food, multiplier) => {
    return {
      calories: Math.round(food.calories * multiplier),
      protein: parseFloat((food.protein * multiplier).toFixed(1)),
      carbs: parseFloat((food.carbs * multiplier).toFixed(1)),
      fat: parseFloat((food.fat * multiplier).toFixed(1)),
    };
  };

  const handleAddMeal = async () => {
    if (isCustom) {
      if (!customName || !customCalories) {
        Alert.alert('Hata', 'Lütfen en az yemek adı ve kalori bilgisi girin.');
        return;
      }
    } else {
      if (!selectedFood || !amount) {
        Alert.alert('Hata', 'Lütfen yemek seçin ve miktar girin.');
        return;
      }
    }

    setLoading(true);

    try {
      const today = getDateString();
      const dailyLog = await getDailyLog(today);

      let mealData;

      if (isCustom) {
        mealData = {
          id: Date.now(),
          name: customName,
          calories: parseInt(customCalories) || 0,
          protein: parseFloat(customProtein) || 0,
          carbs: parseFloat(customCarbs) || 0,
          fat: parseFloat(customFat) || 0,
          mealType,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          amount: 1,
          unit: 'porsiyon',
        };
      } else {
        const multiplier = parseFloat(amount) || 1;
        const nutrients = calculateNutrients(selectedFood, multiplier);

        mealData = {
          id: Date.now(),
          name: selectedFood.name,
          ...nutrients,
          mealType,
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          amount: parseFloat(amount),
          unit: selectedFood.unit,
        };
      }

      dailyLog.meals.push(mealData);
      await saveDailyLog(today, dailyLog);

      Alert.alert('Başarılı', 'Yemek eklendi!', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Yemek eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const renderFoodItem = (food) => {
    const isSelected = selectedFood?.id === food.id;

    return (
      <TouchableOpacity
        key={food.id}
        style={[styles.foodItem, isSelected && styles.foodItemSelected]}
        onPress={() => {
          setSelectedFood(food);
          setIsCustom(false);
          setAmount(String(food.amount));
        }}
      >
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodDetails}>
            {food.amount} {food.unit} • {food.calories} kcal
          </Text>
          <Text style={styles.foodMacros}>
            P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
          </Text>
        </View>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>{mealType} için Yemek Ekle</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, !isCustom && styles.tabActive]}
            onPress={() => setIsCustom(false)}
          >
            <Text style={[styles.tabText, !isCustom && styles.tabTextActive]}>
              Veritabanından Seç
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, isCustom && styles.tabActive]}
            onPress={() => {
              setIsCustom(true);
              setSelectedFood(null);
            }}
          >
            <Text style={[styles.tabText, isCustom && styles.tabTextActive]}>
              Özel Yemek
            </Text>
          </TouchableOpacity>
        </View>

        {!isCustom ? (
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Yemek ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.gray}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={styles.foodList} nestedScrollEnabled>
              {filteredFoods.length > 0 ? (
                filteredFoods.map(renderFoodItem)
              ) : (
                <Text style={styles.emptyText}>Yemek bulunamadı</Text>
              )}
            </ScrollView>

            {selectedFood && (
              <View style={styles.selectedFoodContainer}>
                <Text style={styles.selectedFoodTitle}>Seçilen Yemek:</Text>
                <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>

                <Input
                  label={`Miktar (${selectedFood.unit})`}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder={`Örn: ${selectedFood.amount}`}
                />

                {amount && parseFloat(amount) > 0 && (
                  <View style={styles.calculatedNutrients}>
                    <Text style={styles.calculatedTitle}>Hesaplanan Değerler:</Text>
                    <View style={styles.nutrientRow}>
                      <Text style={styles.nutrientLabel}>Kalori:</Text>
                      <Text style={styles.nutrientValue}>
                        {calculateNutrients(selectedFood, parseFloat(amount) / selectedFood.amount).calories} kcal
                      </Text>
                    </View>
                    <View style={styles.nutrientRow}>
                      <Text style={styles.nutrientLabel}>Protein:</Text>
                      <Text style={styles.nutrientValue}>
                        {calculateNutrients(selectedFood, parseFloat(amount) / selectedFood.amount).protein}g
                      </Text>
                    </View>
                    <View style={styles.nutrientRow}>
                      <Text style={styles.nutrientLabel}>Karbonhidrat:</Text>
                      <Text style={styles.nutrientValue}>
                        {calculateNutrients(selectedFood, parseFloat(amount) / selectedFood.amount).carbs}g
                      </Text>
                    </View>
                    <View style={styles.nutrientRow}>
                      <Text style={styles.nutrientLabel}>Yağ:</Text>
                      <Text style={styles.nutrientValue}>
                        {calculateNutrients(selectedFood, parseFloat(amount) / selectedFood.amount).fat}g
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.customForm}>
            <Input
              label="Yemek Adı *"
              value={customName}
              onChangeText={setCustomName}
              placeholder="Örn: Ev Yapımı Çorba"
            />
            <Input
              label="Kalori (kcal) *"
              value={customCalories}
              onChangeText={setCustomCalories}
              keyboardType="numeric"
              placeholder="Örn: 250"
            />
            <Input
              label="Protein (g)"
              value={customProtein}
              onChangeText={setCustomProtein}
              keyboardType="decimal-pad"
              placeholder="Opsiyonel"
            />
            <Input
              label="Karbonhidrat (g)"
              value={customCarbs}
              onChangeText={setCustomCarbs}
              keyboardType="decimal-pad"
              placeholder="Opsiyonel"
            />
            <Input
              label="Yağ (g)"
              value={customFat}
              onChangeText={setCustomFat}
              keyboardType="decimal-pad"
              placeholder="Opsiyonel"
            />
          </View>
        )}

        <Button
          title="Yemek Ekle"
          onPress={handleAddMeal}
          loading={loading}
          style={{ marginTop: 16 }}
        />
      </Card>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.card,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  foodList: {
    maxHeight: 300,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardSecondary,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  foodDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  foodMacros: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
    paddingVertical: 20,
  },
  selectedFoodContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  selectedFoodTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  calculatedNutrients: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.cardSecondary,
    borderRadius: 8,
  },
  calculatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  nutrientLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  customForm: {
    marginTop: 8,
  },
});

export default AddMealScreen;
