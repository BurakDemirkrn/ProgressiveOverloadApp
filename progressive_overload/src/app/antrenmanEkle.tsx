import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const tasarim = StyleSheet.create({
    anaCerceve: {
        flex: 1,
        backgroundColor: '#d9d9d9'
    },
    kaydirmaAlani: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 100,
    },
    ustBaslik: {
        fontSize: 24,
        color: '#000000',
        marginBottom: 40,
    },
    isimSatiri: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40
    },
    etiket: {
        fontSize: 16,
        marginRight: 10,
    },
    girdiKutusu: {
        backgroundColor: '#222222',
        color: '#ffffff',
        width: 150,
        height: 35,
        paddingHorizontal: 10,
    },
    egzersizSatiri: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '70%'
    },
    sayi: {
        fontSize: 16,
        marginRight: 10,
        width: 25
    },
    egzersizButonu: {
        backgroundColor: '#222222',
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center'
    },
    butonYazisi: {
        color: '#ffffff',
        fontSize: 16,
    },
    devamButonu: {
        backgroundColor: '#222222',
        position: 'absolute',
        bottom: 30,
        right: 40,
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    devamYazisi: {
        color: '#ffffff',
        fontSize: 16,
    }
});

export default function AntrenmanEkle() {
    const [antrenmanAdi, setAntrenmanAdi] = useState('');
    const [egzersizler, setEgzersizler] = useState(['']);
    const egzersizSecildi = (index: number) => {
        const kopyaListe = [...egzersizler];
        kopyaListe[index] = 'Bench Press'
        if (index === kopyaListe.length - 1){
            kopyaListe.push('')
        }
        setEgzersizler(kopyaListe)
    }
    const devamEtTiklandi = () => {
        Alert.alert("Hata","Lütfen bir antrenman adı giriniz!");
        return;
    }
    return(
        <View style = {tasarim.anaCerceve} >
            <ScrollView contentContainerStyle = {tasarim.kaydirmaAlani}>
                <Text style = {tasarim.ustBaslik}>ProgressiveOverload</Text>
                <View style = {tasarim.isimSatiri}>
                    <Text style = {tasarim.etiket}>Antrenman Adı:</Text>
                    <TextInput 
                        style = {tasarim.girdiKutusu} 
                        value = {antrenmanAdi}
                        onChangeText = {setAntrenmanAdi}
                    />
                </View>
                {egzersizler.map((hareketAdi, index) => (
                    <View key = {index} style = {tasarim.egzersizSatiri}>
                        <Text style = {tasarim.sayi}>{index + 1 }</Text>
                        <TouchableOpacity style = {tasarim.egzersizButonu} onPress={() => router.push('/egzersizDetay')}>
                            <Text style = {tasarim.butonYazisi}>{hareketAdi === '' ? 'Egzersiz Seç': hareketAdi}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <TouchableOpacity style={tasarim.devamButonu} onPress={devamEtTiklandi}>
                <Text style={tasarim.devamYazisi}>Devam Et</Text>
            </TouchableOpacity>
        </View>
    )
} 