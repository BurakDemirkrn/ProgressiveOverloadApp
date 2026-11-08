import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function AcilisEkrani() {
    
    useEffect(() => {
        // Ekran açılır açılmaz hafızayı kontrol eden fonksiyon
        const hafizayiKontrolEt = async () => {
            try {
                // Daha önce kaydettiğimiz 'kullaniciKayitli' notunu okuyoruz
                const kayitliMi = await AsyncStorage.getItem('kullaniciKayitli');
                
                if (kayitliMi === 'evet') {
                    // Not 'evet' ise, hiç bekletmeden anasayfaya fırlat (Geri dönülemez şekilde)
                    router.replace('/anasayfa');
                } else {
                    // Not yoksa veya boşsa, kayıt ekranına yolla
                    router.replace('/kayit');
                }
            } catch (hata) {
                console.log("Hafıza okunurken hata oluştu:", hata);
                router.replace('/kayit'); // Hata olursa güvenli liman olarak kayda yolla
            }
        };

        // Bu işlemi başlat
        hafizayiKontrolEt();
    }, []);

    // Arka planda bu kontrol yapılırken (saliselik bir işlem) ekranda dönen yükleme simgesi göster
    return (
        <View style={tasarim.merkez}>
            <ActivityIndicator size="large" color="#222222" />
        </View>
    );
}

const tasarim = StyleSheet.create({
    merkez: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9d9d9', // Uygulama temanla uyumlu arkaplan
    }
});