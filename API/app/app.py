from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pyodbc

app = FastAPI(title="Progressive Overload API")

server_name = r'burakd'
database_name = "ProgressiveOverload"
conn_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server_name};DATABASE={database_name};Trusted_Connection=yes;"

def get_db_connection():
    return pyodbc.connect(conn_string)

class HareketDetay(BaseModel):
    hareket_id: int
    sira: int
    set_sayilari: int
    min_tekrar: int
    max_tekrar: int

class YeniSablon(BaseModel):
    kullanici_id: int
    sablon_adi: str
    hareketler: List[HareketDetay]

class YeniKullanici(BaseModel):
    ad: str
    soyad: str
    dogum_tarihi: str
    kilo: float

@app.post("/kayit-ol")
def kayit_ol(kullanici: YeniKullanici):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tUsers (FirstName, SurName, Birthday, BodyWeight) 
        OUTPUT INSERTED.ID
        VALUES (?,?,?,?)
    """, kullanici.ad, kullanici.soyad, kullanici.dogum_tarihi, kullanici.kilo)

    yeni_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()
    
    # JSON formatı düzeltildi
    return {
        "durum": "Basarili",
        "kullanici_id": yeni_id,
        "mesaj": f"Hoş geldin {kullanici.ad}."
    }

# Veri okuma işlemi olduğu için get yapıldı
@app.get("/profil/{kullanici_id}")
def profil_getir(kullanici_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT ID, FirstName, SurName, BodyWeight FROM tUsers WHERE ID = ?", kullanici_id)
    kullanici = cursor.fetchone()
    conn.close()

    if kullanici:
        # ID büyük harfle yazıldı çünkü SQL'den ID olarak dönüyor
        return {
            "id": kullanici.ID, 
            "ad": kullanici.FirstName, 
            "soyad": kullanici.SurName, 
            "kilo": kullanici.BodyWeight
        }
    else:
        raise HTTPException(status_code=404, detail="Kullanıcı Bulunamadı")

@app.get("/kategoriler")
def kategorileri_getir():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT ID,MainCategoryName FROM tMainCategories")
    kategoriler = cursor.fetchall()
    conn.close()

    sonuc_listesi = []
    for k in kategoriler:
        sonuc_listesi.append({"id":k.ID,"isim":k.MainCategoryName})

    return {"ana_bolgeler": sonuc_listesi}

@app.get("/hareketler/{ana_kategori_id}")
def hareketleri_getir(ana_kategori_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT e.ID, e.ExercisesName, s.SubCategoryName FROM tExercises e
        JOIN tSubCategories s ON e.CategoryID = s.ID
        WHERE s.MainCategoryID = ?
    """,ana_kategori_id)

    hareketler = cursor.fetchall()
    conn.close()

    sonuc_listesi = []
    for h in hareketler:
        sonuc_listesi.append({
                "id":h.ID,
                "isim":h.ExercisesName,
                "alt_bolge":h.SubCategoryName
            })

    return {"hareketler":sonuc_listesi}

@app.post("/sablon-olustur")
def sablon_olustur(sablon: YeniSablon):
    conn= get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO tWorkoutTemplates (UserID,TemplateName)
            OUTPUT INSERTED.ID
            VALUES (?,?)
        """,sablon.kullanici_id,sablon.sablon_adi)

        yeni_sablon_id = cursor.fetchone()[0]

        for h in sablon.hareketler:
            cursor.execute("""
                INSERT INTO tTemplateExercises
                (WorkoutTemplateID,ExercisesID,ExercisesOrder,DefaultSets,DefaultMinRep,DefaultMaxRep)
                VALUES (?,?,?,?,?,?)
            """,yeni_sablon_id, h.hareket_id,h.sira,h.set_sayilari,h.min_tekrar,h.max_tekrar) 

        conn.commit()
        return {"mesaj":f"{sablon.sablon_adi} şablonu başarıyla oluşturuldu","sablon_id":yeni_sablon_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=f"Şablon kaydedilirken hata oluştu: {str(e)}")
    finally:
        conn.close()

@app.get("/sablonlar/{kullanici_id}")
def sablonlari_geti(kullanici_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("Select ID, TemplateName FROM tWorkoutTemplates WHERE UserID = ?",kullanici_id)
    sablonlar = cursor.fetchall()
    conn.close()

    sonuc_listesi = []
    for s in sablonlar:
        sonuc_listesi.append({"sablon_id":s.ID,
                              "sablon_adi":s.TemplateName})

    return {"sablonlar": sonuc_listesi}

@app.get("/sablon-detay/{sablon_id}")
def sablon_detay_getir(sablon_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()


    cursor.execute("""
        select e.ID, w.TemplateName, e.ExercisesName, t.ExercisesOrder, t.DefaultSets, t.DefaultMinRep, t.DefaultMaxRep 
        from tTemplateExercises t
        join tExercises e on t.ExercisesID = e.ID
        join tWorkoutTemplates w on t.WorkoutTemplateID = w.ID
        where t.WorkoutTemplateID = ?
        order by t.ExercisesOrder
    """, sablon_id)

    hareketler = cursor.fetchall()
    conn.close()

    # Eğer şablon boşsa hata vermesin diye ufak bir kontrol
    if not hareketler:
        return {"mesaj": "Bu şablonda henüz hareket yok."}

    sonuc_listesi = []
    for h in hareketler:
        sonuc_listesi.append({
            "hareket_id": h.ID,
            "egzersiz_adi": h.ExercisesName,
            "egzersiz_sirasi": h.ExercisesOrder,
            "set_sayilari": h.DefaultSets,
            "min_tekrar": h.DefaultMinRep,
            "max_tekrar": h.DefaultMaxRep
        })

    # "İtiş" ismini döngüden çıkardık, hareketler[0] ile ilk satırdan 1 kere alıp en üste koyduk
    return {
        "sablon_adi": hareketler[0].TemplateName,
        "hareketler": sonuc_listesi
    }