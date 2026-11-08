# -*- coding: utf-8 -*-
import pandas as pd
import pyodbc

server = 'burakd'
database = 'ProgressiveOverload'
dosya_adi = 'resist_train_planner.xls'

mapping = {
    'Chest - Pectoralis': [1],
    'Shoulders - Delts/Traps': [2],
    'Shoulders - Rotator Cuff': [2],
    'Triceps': [3,11],
    'Back - Latissimus Dorsi': [4],
    'Back - Lat.Dorsi/Rhomboids': [5],
    'Biceps': [6,10],
    'Legs - Quadriceps': [7],
    'Legs - Hamstrings': [8],
    'Calves - Soleus': [9],
    'Calves - Gastrocnemius': [9],
    'Abdominals - Obliques':[13],
    'Abdominals - Total':[13],
    'Abdominals - Lower': [13],
    'Abdominals - Upper':[13],
    'Lower Back - Erector Spinae': [14]
    }

try:
    print("--------------------------------------------------")
    print("Islem baslatildi, lutfen bekleyin...")
    print("-> Excel dosyasi okunuyor ve SQL baglantisi kuruluyor...")
    print("--------------------------------------------------")
        
    df = pd.read_excel('resist_train_planner.xls', 
                   sheet_name=0,        
                   skiprows=18,         
                   usecols="B,C",       
                   names=['MuscleGroup', 'ExerciseName'])

    conn_str = f'Driver={{SQL Server}};Server={server};Database={database};Trusted_Connection=yes;'
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()

    print("\n[BASARILI] SQL Server ile baglanti kuruldu.")
    print("Veriler tablolara aktariliyor, bu islem biraz surebilir...\n")


    eklenen_sayisi = 0
    for index, row in df.iterrows():
        kas_grubu=str(row['MuscleGroup']).strip()
        hareket_adi=str(row['ExerciseName']).strip()

        if kas_grubu in mapping:
            for sub_id in mapping[kas_grubu]:
                cursor.execute("INSERT INTO tExercises (CategoryID, ExercisesName) VALUES (?,?)",
                               (sub_id,hareket_adi))
                eklenen_sayisi += 1

    conn.commit()
    print(f"İşlem tamam!Toplam {eklenen_sayisi} kayıt oluşturuldu.")

except Exception as e:
    print(f"Bir hata oluştu: {e}")

finally:
    if 'conn' in locals():
        conn.close()
        print("Veritabanı bağlantısı kapatıldı.")

