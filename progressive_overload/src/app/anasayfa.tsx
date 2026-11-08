import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tasarim = StyleSheet.create({
    anaCerceve: {
        flex: 1,
        backgroundColor: '#d9d9d9',
        alignItems: 'center',
        paddingTop: 80,
    },
    ustBaslik: {
        fontSize: 24,
        color: '#000000',
        marginTop: 60,
    },
    buyukButon:{
        backgroundColor: '#222222',
        width: '75%',
        paddingVertical: 30,
        alignItems:'center',
        marginBottom: 20,
    },
    buyukButonYazisi:{
        color: '#ffffff',
        fontSize: 18,
    },
    altButonlarKapsayici:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        position: 'absolute',
        bottom: 50,
    },
    kucukButon: {
        backgroundColor: '#222222',
        paddingVertical: 12,
        paddingHorizontal:25,
    },
    kucukButonYazisi: {
        color:'#ffffff',
        fontSize: 16
    }

});

export default function AnaSayfa(){
    return(
        <View style = {tasarim.anaCerceve}>
            <Text style={tasarim.ustBaslik}>Progressive Overload</Text>

            <TouchableOpacity 
                style={tasarim.buyukButon} 
                onPress={()=> router.push('/antrenmanEkle')} 
                >
                <Text style = {tasarim.buyukButonYazisi}>Antrenman Oluştur</Text> 
            </TouchableOpacity>
            
            <View style = {tasarim.altButonlarKapsayici}>
                <TouchableOpacity style = {tasarim.kucukButon}>
                    <Text style = {tasarim.kucukButonYazisi}>Sil</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {tasarim.kucukButon}>
                    <Text style = {tasarim.kucukButonYazisi}>Düzenle</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}