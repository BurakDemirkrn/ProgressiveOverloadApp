import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const tasarim = StyleSheet.create({
    anaCerceve: {
        flex: 1,
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        paddingTop: 80,
    },
    ustBaslik:{
        fontSize: 24,
        color: '#000000',
        marginBottom: 80,
    },
    formAlani: {
        width: '70%',
    },
    satir:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    etiketYazisi: {
        fontSize: 18,
        color: '#000000',
    },
    girdiKutusu: {
        backgroundColor: '#222222',
        color: '#ffffff',
        width: 140,
        height: 40,
        paddingHorizontal: 10,
    },
    devamButonu:{
        backgroundColor: '#222222',
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 40,
    },
    butonIciYazi: {
        color: '#ffffff',
        fontSize: 18,
    }
});

export default function KayitEkrani() {
    const[isim, isimKaydet] = useState('');
    const[soyisim,soyisimKaydet] = useState('');
    const[dogumtarihi,dogumtarihiKaydet] = useState('');
    const[kilo,kiloKaydet] = useState('');

    const veritabaninaGonder = async () => {
        // 1. Tarihi YYYY-MM-DD formatına çeviriyoruz
        const parcalar = dogumtarihi.split(/[-/.]/);
        const formatliTarih = `${parcalar[2]}-${parcalar[1]}-${parcalar[0]}`;
        
        // 2. FastAPI'nin beklediği tam etiketler (ad, soyad)
        const paket = {
            ad: isim,
            soyad: soyisim,
            dogum_tarihi: formatliTarih,
            kilo: parseFloat(kilo)
        };
        
        try {
            const istek = await fetch('http://192.168.1.109:8000/kayit-ol',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paket)
            });

            if (istek.ok) {
                console.log("Kayıt Başarılı! Paket:",paket);
                await AsyncStorage.setItem('kullaniciKayitli', 'evet');
                Alert.alert("Başarılı", "Kullanıcı veritabanına kaydedildi!");
                router.replace('/anasayfa');
            } else{
                console.log("Sunucu hatası. Backend veriyi beğenmedi.");
                Alert.alert("Hata", "Sunucu veriyi reddetti. Lütfen bilgileri kontrol edin.");
            }
        } catch (hata) {
            console.log("Bağlantı koptu:",hata);
            Alert.alert("Bağlantı Hatası", "Sunucuya ulaşılamadı.");
        }
    };

    return(
        <View style={tasarim.anaCerceve}>
            <Text style={tasarim.ustBaslik}>Progressive Overload</Text>
            <View style={tasarim.formAlani}>
                <View style={tasarim.satir}>
                    <Text style={tasarim.etiketYazisi}>İsim:</Text>
                    <TextInput 
                        style={tasarim.girdiKutusu}
                        value={isim}
                        onChangeText={isimKaydet}
                    />
                </View>
                <View style={tasarim.satir}>
                    <Text style={tasarim.etiketYazisi}>Soyisim:</Text>
                    <TextInput 
                        style={tasarim.girdiKutusu}
                        value={soyisim}
                        onChangeText={soyisimKaydet}
                    />
                </View>
                <View style={tasarim.satir}>
                    <Text style={tasarim.etiketYazisi}>Doğum Tarihi:</Text>
                    <TextInput 
                        style={tasarim.girdiKutusu}
                        value={dogumtarihi}
                        onChangeText={dogumtarihiKaydet}
                        placeholder="GG.AA.YYYY"
                        placeholderTextColor="#888"
                    />
                </View>
                <View style={tasarim.satir}>
                    <Text style={tasarim.etiketYazisi}>Kilo:</Text>
                    <TextInput 
                        style={tasarim.girdiKutusu}
                        value={kilo}
                        onChangeText={kiloKaydet}
                        keyboardType='numeric'
                    />
                </View>
            </View>
            <TouchableOpacity 
                style={tasarim.devamButonu}
                onPress={veritabaninaGonder}
            >
                <Text style={tasarim.butonIciYazi}>Devam Et</Text>
            </TouchableOpacity>
        </View>
    );
}