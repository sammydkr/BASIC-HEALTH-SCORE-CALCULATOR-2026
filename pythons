# carnivore_api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import sqlite3
from datetime import datetime, date
import json

app = FastAPI(title="Carnivore Diet API", version="1.0.0")

# Database setup
def get_db_connection():
    conn = sqlite3.connect('carnivore_diet.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    conn = get_db_connection()
    
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            weight_kg REAL,
            height_cm REAL,
            age INTEGER,
            activity_level TEXT,
            goal TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Food log table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS food_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            food_name TEXT NOT NULL,
            food_type TEXT,
            calories REAL,
            protein REAL,
            fat REAL,
            servings REAL,
            log_date DATE,
            meal_type TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Progress table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            weight_kg REAL,
            energy_level INTEGER,
            mental_clarity INTEGER,
            digestive_health INTEGER,
            notes TEXT,
            log_date DATE,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    weight_kg: float
    height_cm: float
    age: int
    activity_level: str
    goal: str

class FoodLogCreate(BaseModel):
    username: str
    food_name: str
    food_type: str
    calories: float
    protein: float
    fat: float
    servings: float
    meal_type: str

class ProgressCreate(BaseModel):
    username: str
    weight_kg: float
    energy_level: int
    mental_clarity: int
    digestive_health: int
    notes: Optional[str] = None

@app.on_event("startup")
async def startup_event():
    init_database()

@app.post("/users/", response_model=Dict)
async def create_user(user: UserCreate):
    """Create new user"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (username, weight_kg, height_cm, age, activity_level, goal)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user.username, user.weight_kg, user.height_cm, user.age, user.activity_level, user.goal))
        
        conn.commit()
        user_id = cursor.lastrowid
        
        return {"message": "User created successfully", "user_id": user_id}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

@app.post("/food-log/", response_model=Dict)
async def add_food_log(log: FoodLogCreate):
    """Add food to daily log"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user ID
    cursor.execute("SELECT id FROM users WHERE username = ?", (log.username,))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user['id']
    
    # Add to food log
    cursor.execute('''
        INSERT INTO food_log 
        (user_id, food_name, food_type, calories, protein, fat, servings, log_date, meal_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE('now'), ?)
    ''', (user_id, log.food_name, log.food_type, log.calories, log.protein, log.fat, log.servings, log.meal_type))
    
    conn.commit()
    conn.close()
    
    return {"message": "Food log added successfully"}

@app.post("/progress/", response_model=Dict)
async def add_progress(progress: ProgressCreate):
    """Add daily progress tracking"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user ID
    cursor.execute("SELECT id FROM users WHERE username = ?", (progress.username,))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user['id']
    
    # Add progress entry
    cursor.execute('''
        INSERT INTO progress 
        (user_id, weight_kg, energy_level, mental_clarity, digestive_health, notes, log_date)
        VALUES (?, ?, ?, ?, ?, ?, DATE('now'))
    ''', (user_id, progress.weight_kg, progress.energy_level, progress.mental_clarity, 
          progress.digestive_health, progress.notes))
    
    conn.commit()
    conn.close()
    
    return {"message": "Progress recorded successfully"}

@app.get("/daily-summary/{username}")
async def get_daily_summary(username: str, target_date: Optional[str] = None):
    """Get daily food summary and totals"""
    conn = get_db_connection()
    
    if not target_date:
        target_date = date.today().isoformat()
    
    # Get user ID
    cursor = conn.execute("SELECT id FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user['id']
    
    # Get food log for date
    cursor = conn.execute('''
        SELECT food_name, food_type, calories, protein, fat, servings, meal_type
        FROM food_log 
        WHERE user_id = ? AND log_date = ?
        ORDER BY meal_type
    ''', (user_id, target_date))
    
    food_log = cursor.fetchall()
    
    # Calculate totals
    totals = {
        'calories': 0,
        'protein': 0,
        'fat': 0,
        'meal_count': len(food_log)
    }
    
    meals_by_type = {}
    
    for food in food_log:
        food_dict = dict(food)
        servings = food_dict['servings']
        
        totals['calories'] += food_dict['calories'] * servings
        totals['protein'] += food_dict['protein'] * servings
        totals['fat'] += food_dict['fat'] * servings
        
        meal_type = food_dict['meal_type']
        if meal_type not in meals_by_type:
            meals_by_type[meal_type] = []
        
        meals_by_type[meal_type].append(food_dict)
    
    conn.close()
    
    return {
        "date": target_date,
        "username": username,
        "totals": totals,
        "meals_by_type": meals_by_type,
        "foods": [dict(food) for food in food_log]
    }

@app.get("/carnivore-foods/")
async def get_carnivore_foods():
    """Get list of approved carnivore foods"""
    foods = [
        {
            "name": "Ribeye Steak",
            "type": "beef",
            "calories": 291,
            "protein": 25,
            "fat": 21,
            "carnivore_rating": 10,
            "benefits": ["High in iron", "Rich in zinc", "Complete protein"]
        },
        {
            "name": "Salmon",
            "type": "fish", 
            "calories": 206,
            "protein": 22,
            "fat": 13,
            "carnivore_rating": 9,
            "benefits": ["Omega-3 fatty acids", "Vitamin D", "Anti-inflammatory"]
        },
        {
            "name": "Eggs",
            "type": "eggs",
            "calories": 155,
            "protein": 13,
            "fat": 11,
            "carnivore_rating": 9,
            "benefits": ["Choline for brain health", "Complete protein", "Vitamins A, D, E"]
        },
        {
            "name": "Liver (Beef)",
            "type": "organ_meats",
            "calories": 135,
            "protein": 20,
            "fat": 4,
            "carnivore_rating": 10,
            "benefits": ["Vitamin A", "B12", "Copper", "Iron"]
        },
        {
            "name": "Bacon",
            "type": "pork",
            "calories": 541,
            "protein": 37,
            "fat": 42,
            "carnivore_rating": 8,
            "benefits": ["High in fat for energy", "B vitamins", "Satiating"]
        }
    ]
    
    return {"foods": foods}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
