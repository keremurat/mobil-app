// BMR (Bazal Metabolizma Hızı) Hesaplama - Mifflin-St Jeor Denklemi
export const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'erkek') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Günlük Kalori İhtiyacı (Aktivite Seviyesine Göre)
export const calculateDailyCalories = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedanter: 1.2,
    'hafif aktif': 1.375,
    aktif: 1.55,
    'çok aktif': 1.725,
  };
  return Math.round(bmr * (activityMultipliers[activityLevel] || 1.2));
};

// Hedefe Göre Kalori Ayarlama
export const adjustCaloriesForGoal = (dailyCalories, goal) => {
  if (goal === 'kilo ver') {
    return Math.round(dailyCalories - 500); // 500 kalori açığı
  } else if (goal === 'kilo al') {
    return Math.round(dailyCalories + 500); // 500 kalori fazlası
  }
  return dailyCalories; // Kilo koru
};

// BMI (Vücut Kitle İndeksi) Hesaplama
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// BMI Kategorisi
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Zayıf';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Fazla Kilolu';
  return 'Obez';
};

// İdeal Kilo Aralığı (BMI 18.5-25 arası)
export const getIdealWeightRange = (height) => {
  const heightInMeters = height / 100;
  const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
  const maxWeight = (25 * heightInMeters * heightInMeters).toFixed(1);
  return { min: minWeight, max: maxWeight };
};

// Makro Besin Oranları (Protein, Karbonhidrat, Yağ)
export const calculateMacros = (dailyCalories) => {
  return {
    protein: Math.round((dailyCalories * 0.3) / 4), // 30% protein (4 cal/g)
    carbs: Math.round((dailyCalories * 0.4) / 4), // 40% karbonhidrat (4 cal/g)
    fat: Math.round((dailyCalories * 0.3) / 9), // 30% yağ (9 cal/g)
  };
};

// Su İhtiyacı Hesaplama (kg başına 35ml)
export const calculateWaterNeeds = (weight) => {
  return Math.round((weight * 35) / 250); // Bardak cinsinden (1 bardak = 250ml)
};

// Egzersiz Kalori Yakımı (kilo ve süreye göre tahmini)
export const calculateWorkoutCalories = (weight, duration, intensity = 'orta') => {
  const intensityMultipliers = {
    düşük: 3,
    orta: 6,
    yüksek: 9,
  };
  return Math.round(weight * duration * (intensityMultipliers[intensity] / 60));
};
