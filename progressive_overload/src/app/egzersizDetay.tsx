import { router } from 'expo-router';
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const tasarim = StyleSheet.create({
    anaCerceve: {
        flex: 1,
        backgroundColor:'#d9d9d9',
        padding:20,    
    },
    anaBaslik: {
        fontSize: 20,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop:40,
        marginBottom:30,
        color:'#1e1e1e',
    },
    ustBilgiKutusu: {
        backgroundColor: '#1e1e1e',
        width: 100,
        paddingVertical:8,
        alignItems:'center',
        marginBottom: 20,
    },
    ustBilgiYazisi: {
        color:'#ffffff',
        fontSize:16,
    },
    siraYazisi: {
        fontSize: 16,
        color: '#1e1e1e',
        marginBottom: 30,
    },
    satirCerceve: {
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    satirEtiketi: {
        flex:1,
        fontSize:16,
        color:'#1e1e1e',   
    },
    siyahKutu: {
        flex: 1.5,
        backgroundColor: '#1e1e1e',
        paddingVertical: 10,
        paddingHorizontal: 10,
        minHeight: 40,
        justifyContent: 'center',
    },
    siyahKutuYazisi: {
        color: '#fff',
        fontSize: 14,
    },
    altButonCercevesi: {
        flex:1,
        justifyContent:'flex-end',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    devamButonu: {
        backgroundColor: '#1e1e1e',
        paddingVertical: 12,
        paddingHorizontal:30,
    },
    devamButonuYazisi: {
        color: '#fff',
        fontSize:16,
    },
    modalArkaplan: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    modalListeKutusu: {
        backgroundColor: '#1e1e1e',
        width: '60%',
        maxHeight:'50%',
        paddingVertical: 10,
    },
    listeElemani: {
        paddingVertical:12,
        paddingHorizontal:15,
        borderBottomWidth:0.5,
        borderBottomColor:'#444',
    },
    listeYazisi: {
        color: '#fff',
        fontSize:16,
    }
});

export default function EgzersizDetay() {
    const [secilenAnaKategori,setSecilenAnaKategori] = useState<string>('');
    const [secilenAltKategori,setSecilenAltKategori] = useState<string>('');
    const [secilenEgzersiz, setSecilenEgzersiz] = useState<string>('');

    const [setSayisi, setSetSayisi] = useState<string>('');
    const [minTekrar, setMinTekrar] = useState<string>('');
    const [maxTekrar, setMaxTekrar] = useState<string>('');

    const [acikMenu, setAcikMenu] = useState<'ana' | 'alt' | 'egzersiz' | null>(null);

    const anaKategoriler = ['Push Workouts', 'Pull Workouts', 'Leg Workouts', 'Arm Workouts', 'Core Workouts'];
    const altKategoriler = ['Chest', 'Shoulder', 'Triceps'];
    const egzersizler = ['Alternating Dumbbell Bench Press', 'Barbell Bench Press', 'Chest Press', 'Decline Dumbbell Bench Press'];

    const aktifListeyiGetir = () => {
        if (acikMenu === 'ana') return anaKategoriler;
        if (acikMenu === 'alt' ) return altKategoriler;
        if (acikMenu === 'egzersiz') return egzersizler;
        return [];
    };

    const elemanSecildi = (secim : string) => {
        if (acikMenu === 'ana') setSecilenAnaKategori(secim);
        if (acikMenu === 'alt') setSecilenAltKategori(secim);
        if (acikMenu === 'egzersiz') setSecilenEgzersiz(secim);
        setAcikMenu(null);
    };

    return (
<View style={tasarim.anaCerceve}>
            
            {/* ÜST BAŞLIKLAR */}
            <Text style={tasarim.anaBaslik}>Progressive Overload</Text>
            
            {/* Geçici Antrenman Adı (İleride önceki sayfadan gelecek) */}
            <View style={tasarim.ustBilgiKutusu}>
                <Text style={tasarim.ustBilgiYazisi}>İtiş</Text>
            </View>

            <Text style={tasarim.siraYazisi}>Sıra: 1</Text>

            {/* SEÇİM KUTULARI ALANI */}
            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Ana Kategori:</Text>
                <TouchableOpacity style={tasarim.siyahKutu} onPress={() => setAcikMenu('ana')}>
                    <Text style={tasarim.siyahKutuYazisi}>{secilenAnaKategori}</Text>
                </TouchableOpacity>
            </View>

            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Alt Kategori:</Text>
                <TouchableOpacity style={tasarim.siyahKutu} onPress={() => setAcikMenu('alt')}>
                    <Text style={tasarim.siyahKutuYazisi}>{secilenAltKategori}</Text>
                </TouchableOpacity>
            </View>

            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Egzersizler:</Text>
                <TouchableOpacity style={tasarim.siyahKutu} onPress={() => setAcikMenu('egzersiz')}>
                    <Text style={tasarim.siyahKutuYazisi}>{secilenEgzersiz}</Text>
                </TouchableOpacity>
            </View>

            {/* RAKAM GİRİŞ KUTULARI (TextInput) */}
            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Set Sayısı:</Text>
                <TextInput 
                    style={[tasarim.siyahKutu, tasarim.siyahKutuYazisi, {textAlign: 'center'}]} 
                    keyboardType="numeric" // Sadece rakam klavyesi açılır
                    value={setSayisi}
                    onChangeText={setSetSayisi}
                />
            </View>

            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Min Tekrar:</Text>
                <TextInput 
                    style={[tasarim.siyahKutu, tasarim.siyahKutuYazisi, {textAlign: 'center'}]} 
                    keyboardType="numeric"
                    value={minTekrar}
                    onChangeText={setMinTekrar}
                />
            </View>

            <View style={tasarim.satirCerceve}>
                <Text style={tasarim.satirEtiketi}>Max Tekrar:</Text>
                <TextInput 
                    style={[tasarim.siyahKutu, tasarim.siyahKutuYazisi, {textAlign: 'center'}]} 
                    keyboardType="numeric"
                    value={maxTekrar}
                    onChangeText={setMaxTekrar}
                />
            </View>

            {/* DEVAM ET BUTONU (Sağ alta hizalı) */}
            <View style={tasarim.altButonCercevesi}>
                <TouchableOpacity style={tasarim.devamButonu} onPress={() => router.back()}>
                    <Text style={tasarim.devamButonuYazisi}>Devam Et</Text>
                </TouchableOpacity>
            </View>

            {/* 
                AÇILIR PENCERE (MODAL) - İSTEDİĞİN ÖZELLİK BURADA!
                transparent={true}: Arka planı tamamen siyah yapmak yerine şeffaf (arkayı gösteren) yapar.
                onRequestClose: Android'de fiziksel geri tuşuna basınca menüyü kapatır.
            */}
            <Modal
                visible={acikMenu !== null} 
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAcikMenu(null)}
            >
                {/* 
                    Pressable: Ekranın kalan boş kısımlarını kaplayan görünmez bir buton görevi görür.
                    Boşluğa tıklandığında menüyü kapatır (setAcikMenu(null)).
                */}
                <Pressable style={tasarim.modalArkaplan} onPress={() => setAcikMenu(null)}>
                    
                    {/* Liste kutusunun boşluğa tıklanma algılayıcısından etkilenmemesi için kendi kutusu */}
                    <View style={tasarim.modalListeKutusu}>
                        <FlatList 
                            data={aktifListeyiGetir()}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity 
                                    style={tasarim.listeElemani}
                                    onPress={() => elemanSecildi(item)}
                                >
                                    <Text style={tasarim.listeYazisi}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                </Pressable>
            </Modal>

        </View>        
    )
}