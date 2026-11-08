def calculate_next_set_upper_body(current_weight, min_rep, max_rep, actual_reps, rir):
    #Max tekrarı fazladan aştığı zamanki ilerleme
    total_capacity = actual_reps + rir

    if total_capacity >= max_rep +3:
        new_weight = current_weight + 5
        return{
            "status":"super_progress",
            "primary_plan":{
                "weight":new_weight,
                "min_rep":min_rep,
                "max_rep":max_rep,
                "message":f"Yeni ağırlık:{new_weight}kg. Hedef:{min_rep}-{max_rep} tekrar"}
            }
    
    #Normal ilerleme
    elif actual_reps >= max_rep and rir>0:
        new_weight = current_weight + 2.5 #Üst vücut için 2.5 kg. Alt vücut için 5 kg
        new_min_rep = min_rep + 2
        new_max_rep = max_rep + 2
        return {
            "status": "progress",
            "primary_plan":{
                "weight": new_weight,
                "min_rep": min_rep,
                "max_rep": max_rep,
                "message":f"Yeni ağırlık: {new_weight}kg. Hedef : {min_rep}-{max_rep}"
                },
            "alternative_plan":{
                "weight":current_weight,
                "min_rep":new_min_rep,
                "max_rep":new_max_rep,
                "message":f"Plaka yoksa: {current_weight}kg ile {new_min_rep}-{new_max_rep} tekrar"
                }
            }
    
    #Ağırlığı koruma
    elif min_rep <= actual_reps < max_rep:
        target_rep = actual_reps + 1
        return {
            "status":"maintain",
            "primary_plan":{
                "weight":current_weight,
                "min_rep":target_rep,
                "max_rep":max_rep,
                "message": f"Ağırlığı koru:{current_weight}kg. Haftaya{target_rep} tekrar deniyoruz."
                }
            }

    #Ağırlık düşme
    else:
        if actual_reps<min_rep:
            deload_weight = current_weight * 0.90
            return {
                "status":"deload",
                "primary_plan":{
                    "weight":deload_weight,
                    "min_rep":min_rep,
                    "max_rep":max_rep,
                    "message":f"Min tekrara ulaşılamadı. Ağırlık düşünüz: {deload_weight}kg "
                    }
                }

