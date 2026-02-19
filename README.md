# Sağlık & Fitness Takip Uygulaması 🏃‍♂️💪

Türkçe dil desteği ile tam özellikli bir sağlık ve fitness takip mobil uygulaması. React Native ve Expo ile geliştirilmiştir.

## 🌟 Özellikler

### 📱 4 Ana Sekme

1. **Ana Sayfa**
   - Günlük özet kartları (kalori, su, adım, egzersiz)
   - Günlük hedef progress bar'ları
   - Motivasyon mesajları
   - Son aktiviteler listesi

2. **Kalori Takibi**
   - Günlük kalori hedefi (kullanıcı tarafından ayarlanabilir)
   - Öğün bazlı takip (Kahvaltı, Öğle, Akşam, Ara Öğün)
   - 60+ Türk yemeği kalori veritabanı
   - Özel yemek ekleme
   - Makro besin takibi (Protein, Karbonhidrat, Yağ)
   - Haftalık kalori grafiği
   - BMR hesaplama ekranı

3. **Egzersiz Takibi**
   - 6 egzersiz kategorisi:
     - Sabah Egzersizleri
     - Yoga
     - Ev Sporu
     - İş'te Spor
     - Bedensel Engelliler İçin Spor
     - Görme Engelliler İçin Spor
   - 25+ hazır egzersiz
   - Zamanlayıcı ve set takibi
   - Kalori yakımı tahmini
   - Haftalık egzersiz istatistikleri

4. **Profil**
   - Kullanıcı bilgileri (ad, yaş, cinsiyet, boy, kilo)
   - Aktivite seviyesi ve hedef belirleme
   - Otomatik hesaplamalar:
     - BMR (Bazal Metabolizma Hızı)
     - Günlük kalori ihtiyacı
     - BMI (Vücut Kitle İndeksi)
     - İdeal kilo aralığı
   - Veri sıfırlama

## 🛠️ Teknoloji Stack

- **Framework:** Expo SDK 52
- **UI Framework:** React Native
- **Navigation:** React Navigation (Bottom Tab + Stack)
- **Storage:** AsyncStorage (local storage)
- **Icons:** expo-vector-icons
- **Animations:** React Native Reanimated

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo Go uygulaması (mobil cihazda test için)

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Uygulamayı başlatın:**
   ```bash
   npm start
   ```

3. **Mobil cihazda test edin:**
   - iOS: Expo Go ile QR kodu tarayın
   - Android: Expo Go ile QR kodu tarayın
   - Emulator: `npm run android` veya `npm run ios`

## 📊 Veri Yapısı

### AsyncStorage Keys

- `@user_profile`: Kullanıcı profil bilgileri
- `@daily_logs`: Günlük yemek ve egzersiz kayıtları

### User Profile
```javascript
{
  name: string,
  age: number,
  gender: 'erkek' | 'kadın',
  height: number,
  weight: number,
  activityLevel: 'sedanter' | 'hafif aktif' | 'aktif' | 'çok aktif',
  goal: 'kilo ver' | 'kilo koru' | 'kilo al',
  dailyCalorieGoal: number,
  dailyWaterGoal: number,
  bmr: number
}
```

### Daily Log
```javascript
{
  date: string,
  meals: Array<{
    id: number,
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    mealType: string,
    time: string,
    amount: number,
    unit: string
  }>,
  workouts: Array<{
    id: number,
    name: string,
    category: string,
    duration: number,
    caloriesBurned: number,
    sets: number,
    reps: number,
    time: string
  }>,
  water: number,
  steps: number
}
```

## 🎨 Tasarım

- **Primary Color:** #E63946 (Kırmızı/Coral)
- **Background:** #F8F9FA (Açık Gri)
- **Modern ve Clean UI**
- **Türkçe dil desteği**
- **Smooth animasyonlar**
- **Progress rings/circles**
- **Card-based layout**

## 📱 Ekran Görüntüleri

*(Uygulama çalıştırıldığında ekran görüntüleri eklenebilir)*

## 🗂️ Proje Yapısı

```
mobil-app/
├── App.js                      # Ana uygulama dosyası
├── src/
│   ├── components/             # Yeniden kullanılabilir UI bileşenleri
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── ProgressBar.js
│   │   └── ProgressRing.js
│   ├── constants/              # Sabitler (renkler, vb.)
│   │   └── colors.js
│   ├── data/                   # Veritabanları
│   │   ├── foodDatabase.js     # 60+ Türk yemeği
│   │   └── workoutDatabase.js  # 25+ egzersiz
│   ├── navigation/             # Navigasyon yapısı
│   │   └── AppNavigator.js
│   ├── screens/                # Uygulama ekranları
│   │   ├── HomeScreen.js
│   │   ├── CalorieTrackerScreen.js
│   │   ├── AddMealScreen.js
│   │   ├── BMRCalculatorScreen.js
│   │   ├── WorkoutScreen.js
│   │   ├── WorkoutCategoryScreen.js
│   │   ├── WorkoutDetailScreen.js
│   │   └── ProfileScreen.js
│   └── utils/                  # Yardımcı fonksiyonlar
│       ├── calculations.js     # BMR, BMI, vs. hesaplamaları
│       └── storage.js          # AsyncStorage işlemleri
├── assets/                     # Resimler ve iconlar
├── package.json
└── README.md
```

## 🚀 Özellikler Detayı

### Kalori Hesaplamaları
- **Mifflin-St Jeor Denklemi** ile BMR hesaplama
- Aktivite seviyesine göre günlük kalori ihtiyacı
- Hedefe göre kalori ayarlama (±500 kcal)

### BMI Hesaplama
- Vücut Kitle İndeksi hesaplama
- BMI kategorisi belirleme (Zayıf/Normal/Fazla Kilolu/Obez)
- İdeal kilo aralığı önerisi

### Makro Besin Dağılımı
- %30 Protein
- %40 Karbonhidrat
- %30 Yağ

## 🔄 Geliştirme Planları

- [ ] Su takibi özelliği (bardak ekleme/çıkarma)
- [ ] Adım sayacı entegrasyonu
- [ ] Bildirimler (hatırlatmalar)
- [ ] Veri export/import
- [ ] Karanlık mod
- [ ] Dil seçeneği (EN/TR)
- [ ] Grafik iyileştirmeleri

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👤 Geliştirici

Claude Code ile geliştirilmiştir.

---

**Not:** Bu uygulama tamamen offline çalışır ve hiçbir backend servise ihtiyaç duymaz. Tüm veriler cihazda AsyncStorage ile saklanır.
