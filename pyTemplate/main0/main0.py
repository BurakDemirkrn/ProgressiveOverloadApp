import pyodbc
server_name = r'burakd'
database_name = 'ProgressiveOverload'

conn_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server_name};DATABASE={database_name};Trusted_Connection=yes;"

try:
    conn = pyodbc.connect(conn_string)
    cursor=conn.cursor()
    print("Veri Tabanına Başarıyla Bağlanıldı...")
except pyodbc.Error as e:
    print("Veritabanı Hatası:",e)
    exit()

hafiza_dosyasi=r"C:\Users\nesli\OneDrive\Masaüstü\Progressive Overload APP2\hafiza_dosyasi.txt"

def sisteme_kayit_ol():
    print("---PROGRESSİVE OVERLOAD'A HOŞ GELDİNİZ---")
    ad = input("Adınız: ")
    soyad = input("Soyadınız: ")
    dogum_tarihi = input("Doğum Tarihizi (YYYY-AA-GG): ")
    kilo = float(input("Vücut Ağırlığınız (kg): ")) 
    
    kayit_sorgusu = """
            insert into tUsers (FirstName,SurName,BirthDay,BodyWeight)
            output inserted.ID
            values (?,?,?,?)
            """

    cursor.execute(kayit_sorgusu,ad,soyad,dogum_tarihi,kilo)

    yeni_kullanici_id=cursor.fetchone()[0]
    conn.commit()

    dosya = open(hafiza_dosyasi,"w")
    dosya.write(str(yeni_kullanici_id))
    dosya.close()

    print(f"\nKayıt Başarılı! Hoş Geldin {ad}.")
    return yeni_kullanici_id

try:
    dosya = open(hafiza_dosyasi,"r")
    aktif_kullanici_id = dosya.read()
    dosya.close()
    print("---Hoş Geldiniz---")

except FileNotFoundError:
    aktif_kullanici_id = sisteme_kayit_ol()

def antrenman_programi_olustur(kullanici_id):
    print("\n---YENİ ANTRENMAN PROGRAMI OLUŞTUR---")
    program_adi = input("Programın Adı:")
    cursor.execute("insert into tWorkoutTemplates (UserID, TemplateName) output inserted.ID values(?,?)",kullanici_id,program_adi)
    yeni_sablon_id = cursor.fetchone()[0]

    sira = 1
    while True:
        print("\n[Ana Bölgeler]")
        cursor.execute("Select ID,MainCategoryName from tMainCategories")
        for row in cursor.fetchall():
            print(f"[{row.ID}] {row.MainCategoryName}")

        secim = input("\n[0] Bitir ve Kaydet \nHangi bölgeden hareket seçeceksin?  ")
        if secim == "0":
            break

        cursor.execute("""
            Select e.ID, e.ExercisesName, s.SubCategoryName from tExercises e
            join tSubCategories s on e.CategoryID = s.ID 
            where s.MainCategoryID = ?
        """,secim)
        hareketler = cursor.fetchall()

        print("\n[HAREKETLER]")
        for h in hareketler:
            print(f"[{h.ID}] {h.ExercisesName} ({h.SubCategoryName})")

        h_id = input("\nEklemek istediğin hareketin ID'si: ")
        setler = input("Kaç set?: ")
        min_t = input("Min Tekrar?: ")
        max_t = input("Max Tekrar?: ")

        cursor.execute("""
            Insert into tTemplateExercises (WorkoutTemplateID,ExercisesID,ExercisesOrder, DefaultSets, DefaultMinRep, DefaultMaxRep) values (?,?,?,?,?,?)
        """,yeni_sablon_id,h_id,sira,setler,min_t,max_t)
        print(f"Hareket Eklendi!")
        sira += 1
    conn.commit()
    conn.close()
    print(f"\nİşlem Tamam {program_adi} oluşturuldu.")


while True:
    print("\n===============================")
    print("   PROGRESSIVE OVERLOAD APP    ")
    print("===============================")
    print("1. Yeni Antrenman Şablonu Oluştur")
    print("2. Antrenmana Başla (Log Gir) - Yapım Aşamasında")
    print("3. Çıkış")

    secim = input("Seçim yapınız: ")

    if secim == "1":
        antrenman_programi_olustur(aktif_kullanici_id)
    elif secim == "2":
        print("Tadilatta")
    elif secim == "3":
        print("\nUygulamadan çıkılıyor.")
        break
    else:
        print("Geçersiz seçim, tekrar dene.")
