# 🚀 Hızlı Başlangıç Kılavuzu

## Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Uygulamayı Başlatın

```bash
npm start
```

Bu komut Expo Developer Tools'u başlatacaktır.

### 3. Uygulamayı Test Edin

#### Mobil Cihazda (Önerilen)
1. App Store veya Google Play'den **Expo Go** uygulamasını indirin
2. Terminal'de görünen QR kodu Expo Go ile tarayın
3. Uygulama cihazınızda açılacaktır

#### Android Emulator
```bash
npm run android
```

#### iOS Simulator (Sadece Mac)
```bash
npm run ios
```

## 📱 İlk Kullanım

1. Uygulama açıldığında **Profil** sekmesine gidin
2. Kişisel bilgilerinizi girin:
   - Ad
   - Yaş
   - Cinsiyet
   - Boy (cm)
   - Kilo (kg)
   - Aktivite seviyesi
   - Hedefiniz (kilo ver/koru/al)
3. **Kaydet** butonuna basın
4. Artık tüm özellikler kullanıma hazır! 🎉

## 🎯 Özellik Keşfi

### Ana Sayfa
- Günlük hedeflerinizi ve ilerlemenizi görün
- Son öğünlerinizi ve egzersizlerinizi takip edin

### Kalori Takibi
- **Yemek Ekle** butonuna basın
- 60+ Türk yemeği arasından seçim yapın veya özel yemek girin
- Günlük kalori hedefine ulaşmanız için kalan kaloriyi görün

### Egzersiz
- 6 farklı kategoriden egzersiz seçin
- Zamanlayıcı ile egzersizinizi yapın
- Yaktığınız kalorileri kaydedin

### Profil
- BMR ve BMI değerlerinizi görün
- İdeal kilo aralığınızı öğrenin
- Hedeflerinizi güncelleyin

## 🔧 Sorun Giderme

### Port zaten kullanılıyor
```bash
# Expo'yu farklı bir portta başlatın
npx expo start --port 19001
```

### Cache temizleme
```bash
# Expo cache'i temizle
npx expo start -c
```

### Bağımlılık sorunları
```bash
# node_modules ve package-lock.json'u sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notlar

- Uygulama tamamen offline çalışır
- Tüm veriler cihazınızda AsyncStorage ile saklanır
- İnternet bağlantısına ihtiyaç yoktur
- Verilerinizi silmek için Profil > Tüm Verileri Sıfırla

## 🎨 Ekran Yapısı

```
📱 Ana Sayfa
   ├─ Günlük Özet
   ├─ Hedef İlerleme Barları
   ├─ Motivasyon Mesajı
   └─ Son Aktiviteler

📊 Kalori Takibi
   ├─ Kalori Özeti (Alınan/Hedef/Kalan)
   ├─ Makro Besinler
   ├─ Haftalık Grafik
   ├─ Kahvaltı
   ├─ Öğle
   ├─ Akşam
   ├─ Ara Öğün
   └─ BMR Hesaplama

💪 Egzersiz
   ├─ Günlük Özet
   ├─ Haftalık Grafik
   ├─ Sabah Egzersizleri
   ├─ Yoga
   ├─ Ev Sporu
   ├─ İş'te Spor
   ├─ Bedensel Engelliler İçin Spor
   └─ Görme Engelliler İçin Spor

👤 Profil
   ├─ Kişisel Bilgiler
   ├─ Hedef Bilgileri
   ├─ BMR & BMI Hesaplamaları
   ├─ İdeal Kilo Aralığı
   └─ Veri Yönetimi
```

## 💡 İpuçları

1. **Düzenli Takip:** Her gün öğünlerinizi ve egzersizlerinizi kaydetmeye çalışın
2. **Gerçekçi Hedefler:** Hedeflerinizi kademeli olarak belirleyin
3. **Su Takibi:** Su tüketiminizi unutmayın (yakında eklenecek)
4. **Haftalık İnceleme:** Haftalık grafikleri inceleyerek ilerlemenizi görün

## 🆘 Destek

Sorun yaşarsanız:
1. Uygulamayı kapatıp tekrar açın
2. Expo'yu yeniden başlatın (`npm start`)
3. README.md dosyasını kontrol edin

---

**Keyifli Kullanımlar! 🎉**
