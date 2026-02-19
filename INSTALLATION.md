# 📲 Kurulum Talimatları

## Ön Gereksinimler

Sisteminizde aşağıdakilerin kurulu olması gerekir:

- **Node.js** (v14 veya üzeri) - [İndir](https://nodejs.org/)
- **npm** (Node.js ile birlikte gelir)
- **Expo Go** uygulaması (mobil cihazınızda)
  - [iOS için App Store](https://apps.apple.com/app/apple-store/id982107779)
  - [Android için Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Adım Adım Kurulum

### 1. Projeyi Hazırlayın

Proje dosyaları zaten mevcut. Terminal'i açın ve proje klasörüne gidin:

```bash
cd /home/panda/mobil-app
```

### 2. Bağımlılıkları Yükleyin

Tüm gerekli paketleri yüklemek için:

```bash
npm install
```

Bu işlem 5-10 dakika sürebilir. Sabırlı olun! ☕

**Alternatif olarak:**
```bash
yarn install
```

### 3. Uygulamayı Başlatın

Kurulum tamamlandıktan sonra:

```bash
npm start
```

veya

```bash
npx expo start
```

Bu komut Expo DevTools'u açacaktır.

### 4. Uygulamayı Çalıştırın

Terminal'de bir QR kod görünecektir. Şimdi 3 seçeneğiniz var:

#### Seçenek A: Mobil Cihazda Test (Önerilen) 📱

1. **iOS için:**
   - iPhone'unuzla Kamera uygulamasını açın
   - QR kodu tarayın
   - "Expo Go ile Aç" butonuna basın

2. **Android için:**
   - Expo Go uygulamasını açın
   - "Scan QR Code" seçeneğine basın
   - QR kodu tarayın

3. Uygulama birkaç saniye içinde açılacaktır!

#### Seçenek B: Android Emulator 🤖

```bash
npm run android
```

**Not:** Android Studio ve bir emulator kurulu olmalıdır.

#### Seçenek C: iOS Simulator 🍎

```bash
npm run ios
```

**Not:** Sadece Mac'te çalışır. Xcode kurulu olmalıdır.

## Muhtemel Sorunlar ve Çözümler

### Sorun 1: "Cannot find module"

**Çözüm:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Sorun 2: "Port 19000 already in use"

**Çözüm:**
```bash
npx expo start --port 19001
```

### Sorun 3: Metro Bundler Cache Sorunu

**Çözüm:**
```bash
npx expo start -c
```

### Sorun 4: "Expo Go ile bağlanamıyor"

**Çözüm:**
- Bilgisayar ve telefon aynı WiFi ağında olmalı
- Güvenlik duvarını kontrol edin
- Expo Go uygulamasını güncelleyin

### Sorun 5: iOS Simulator açılmıyor (Mac)

**Çözüm:**
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

## İlk Kullanım Adımları

Uygulama başarıyla açıldıktan sonra:

1. **Alt menüden "Profil" sekmesine gidin**
2. **Bilgilerinizi girin:**
   - Adınız: Örn. "Ahmet"
   - Yaş: Örn. "30"
   - Cinsiyet: Erkek/Kadın
   - Boy: Örn. "175" cm
   - Kilo: Örn. "70" kg
   - Aktivite Seviyesi: Seçin
   - Hedef: Kilo ver/koru/al seçin
3. **"Kaydet" butonuna basın**
4. **Artık hazırsınız!** 🎉

## Geliştirme Modunda Çalışma

### Hot Reload
Kod değişiklikleriniz otomatik olarak uygulamaya yansır.

### Debug Menu Açma
- iOS: Cmd + D
- Android: Cmd/Ctrl + M veya cihazı sallayın

### Console Logları Görme
Terminal'de veya Expo DevTools'da görünür.

## Production Build (İsteğe Bağlı)

### Android APK Oluşturma

```bash
# EAS Build kurun
npm install -g eas-cli

# EAS'e login olun
eas login

# Build yapın
eas build -p android --profile preview
```

### iOS App Oluşturma

```bash
eas build -p ios --profile preview
```

**Not:** Apple Developer hesabı gerekir (ücretli).

## Versiyon Kontrolü

Kurulu versiyonları kontrol edin:

```bash
node --version        # Node.js versiyonu
npm --version         # npm versiyonu
npx expo --version    # Expo CLI versiyonu
```

## Önerilen Versiyon

- Node.js: v16.x veya üzeri
- npm: v8.x veya üzeri
- Expo: SDK 52

## Faydalı Komutlar

```bash
# Expo DevTools'u açma
npm start

# Cache temizle ve başlat
npx expo start -c

# Android'de çalıştır
npm run android

# iOS'ta çalıştır (Mac only)
npm run ios

# Bağımlılıkları güncelle
npm update

# Proje bilgisi
npx expo doctor
```

## Performans İpuçları

1. **Development modu:** İlk yükleme yavaş olabilir, normal!
2. **WiFi:** Hızlı WiFi kullanın
3. **Telefon:** iOS 13+ veya Android 5+
4. **RAM:** En az 2GB RAM önerilir

## Ek Kaynaklar

- [Expo Dokümantasyonu](https://docs.expo.dev/)
- [React Native Dokümantasyonu](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## Destek

Sorun yaşarsanız:

1. README.md dosyasını okuyun
2. QUICK_START.md'ye bakın
3. PROJECT_SUMMARY.md'de teknik detayları inceleyin
4. Expo community'ye sorun: https://forums.expo.dev/

---

## Başarılı Kurulum Kontrolü ✅

Aşağıdakiler çalışıyorsa kurulum başarılı:

- [ ] `npm start` komutu çalışıyor
- [ ] QR kod görünüyor
- [ ] Expo Go ile bağlanabiliyor
- [ ] Uygulama açılıyor
- [ ] Bottom navigation görünüyor
- [ ] Profil sekmesi açılıyor
- [ ] Form doldurulabiliyor
- [ ] Veri kaydediliyor

Tüm checkler tamam ise **kurulum başarılı!** 🎉

---

**İyi Kullanımlar! 💪🏃‍♂️**
