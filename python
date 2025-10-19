# health_score.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class HealthScoreCalculator:
    def __init__(self):
        self.user_data = {}
    
    def add_user_data(self, age, weight, height, sleep_hours, steps, water_intake):
        """Kullanıcı verilerini ekle"""
        self.user_data = {
            'age': age,
            'weight': weight,
            'height': height,
            'sleep_hours': sleep_hours,
            'steps': steps,
            'water_intake': water_intake,
            'bmi': self.calculate_bmi(weight, height)
        }
    
    def calculate_bmi(self, weight, height):
        """BMI hesapla"""
        return weight / ((height / 100) ** 2)
    
    def calculate_sleep_score(self, sleep_hours):
        """Uyku skoru hesapla"""
        if sleep_hours >= 7 and sleep_hours <= 9:
            return 100
        elif sleep_hours >= 6 or sleep_hours <= 10:
            return 75
        else:
            return 50
    
    def calculate_activity_score(self, steps):
        """Aktivite skoru hesapla"""
        if steps >= 10000:
            return 100
        elif steps >= 7500:
            return 80
        elif steps >= 5000:
            return 60
        else:
            return 40
    
    def calculate_nutrition_score(self, water_intake, bmi):
        """Beslenme skoru hesapla"""
        water_score = min(water_intake / 2 * 100, 100)  # 2 litre ideal
        bmi_score = 100 if 18.5 <= bmi <= 24.9 else 50
        return (water_score + bmi_score) / 2
    
    def get_overall_health_score(self):
        """Genel sağlık skorunu hesapla"""
        sleep_score = self.calculate_sleep_score(self.user_data['sleep_hours'])
        activity_score = self.calculate_activity_score(self.user_data['steps'])
        nutrition_score = self.calculate_nutrition_score(
            self.user_data['water_intake'], 
            self.user_data['bmi']
        )
        
        overall_score = (sleep_score * 0.4 + 
                        activity_score * 0.3 + 
                        nutrition_score * 0.3)
        
        return {
            'overall_score': round(overall_score, 1),
            'sleep_score': sleep_score,
            'activity_score': activity_score,
            'nutrition_score': nutrition_score,
            'bmi': round(self.user_data['bmi'], 1),
            'recommendations': self.generate_recommendations(overall_score)
        }
    
    def generate_recommendations(self, score):
        if score >= 80:
            return ["That is great keep going"]
        elif score >= 60:
            return ["Good Job you should increase your sleep hours"]
        else:
            return [
                "you try to sleep at least 8 hours a day",
                "10.000 steps a day",
                "Drink 2-3 L Water with salt"
            ]

# Example
if __name__ == "__main__":
    calculator = HealthScoreCalculator()
    calculator.add_user_data(
        age=30, 
        weight=70, 
        height=175, 
        sleep_hours=7.5, 
        steps=8500, 
        water_intake=1.8
    )
    
    result = calculator.get_overall_health_score()
    print("SAĞLIK SKORU RAPORU:")
    print(f"Genel Skor: {result['overall_score']}/100")
    print(f"Uyku Skoru: {result['sleep_score']}/100")
    print(f"Aktivite Skoru: {result['activity_score']}/100")
    print(f"Beslenme Skoru: {result['nutrition_score']}/100")
    print(f"BMI: {result['bmi']}")
    print("\nÖNERİLER:")
    for rec in result['recommendations']:
        print(f"- {rec}")
