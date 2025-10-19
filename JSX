// CarnivoreDietApp.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const CarnivoreDietApp = () => {
    const [userProfile, setUserProfile] = useState({
        weight: '80',
        height: '180',
        age: '35',
        activityLevel: 'moderate',
        goal: 'weight_loss'
    });
    
    const [dailyLog, setDailyLog] = useState([]);
    const [todayMeals, setTodayMeals] = useState([]);
    const [waterIntake, setWaterIntake] = useState(0);

    const activityLevels = [
        { value: 'sedentary', label: 'Sedentary' },
        { value: 'light', label: 'Light Exercise' },
        { value: 'moderate', label: 'Moderate Exercise' },
        { value: 'active', label: 'Active' },
        { value: 'very_active', label: 'Very Active' }
    ];

    const goals = [
        { value: 'weight_loss', label: 'Weight Loss' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'muscle_gain', label: 'Muscle Gain' }
    ];

    const carnivoreFoods = [
        { id: 1, name: 'Ribeye Steak', calories: 291, protein: 25, fat: 21, serving: '100g' },
        { id: 2, name: 'Ground Beef', calories: 254, protein: 17, fat: 20, serving: '100g' },
        { id: 3, name: 'Bacon', calories: 541, protein: 37, fat: 42, serving: '100g' },
        { id: 4, name: 'Eggs', calories: 155, protein: 13, fat: 11, serving: '2 large' },
        { id: 5, name: 'Salmon', calories: 206, protein: 22, fat: 13, serving: '100g' },
        { id: 6, name: 'Chicken Thighs', calories: 209, protein: 26, fat: 11, serving: '100g' },
        { id: 7, name: 'Pork Chops', calories: 242, protein: 26, fat: 14, serving: '100g' },
        { id: 8, name: 'Butter', calories: 717, protein: 1, fat: 81, serving: '100g' }
    ];

    const addMeal = (food) => {
        const newMeal = {
            id: Date.now(),
            food: food,
            timestamp: new Date().toLocaleTimeString(),
            servings: 1
        };
        setTodayMeals([...todayMeals, newMeal]);
    };

    const calculateTotals = () => {
        return todayMeals.reduce((totals, meal) => ({
            calories: totals.calories + (meal.food.calories * meal.servings),
            protein: totals.protein + (meal.food.protein * meal.servings),
            fat: totals.fat + (meal.food.fat * meal.servings)
        }), { calories: 0, protein: 0, fat: 0 });
    };

    const getDailyTips = () => {
        const tips = [
            "🥩 Focus on fatty cuts for energy",
            "💧 Add salt to your water for electrolytes",
            "🔥 Cook with animal fats only",
            "🕒 Eat when hungry, don't force meals",
            "🔁 Rotate protein sources regularly",
            "🍳 Include eggs for choline",
            "🐟 Eat fish 2-3 times per week",
            "❤️ Consider organ meats for nutrients"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    };

    const totals = calculateTotals();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🥩 Carnivore Diet Tracker</Text>
                <Text style={styles.headerSubtitle}>Zero Carb. Animal Products Only.</Text>
            </View>

            <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Daily Totals</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totals.calories}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totals.protein}g</Text>
                        <Text style={styles.statLabel}>Protein</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totals.fat}g</Text>
                        <Text style={styles.statLabel}>Fat</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{waterIntake}L</Text>
                        <Text style={styles.statLabel}>Water</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>💡 Carnivore Tip</Text>
                <Text style={styles.tipText}>{getDailyTips()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📝 Today's Meals</Text>
                {todayMeals.length === 0 ? (
                    <Text style={styles.emptyText}>No meals logged today</Text>
                ) : (
                    todayMeals.map(meal => (
                        <View key={meal.id} style={styles.mealItem}>
                            <View style={styles.mealInfo}>
                                <Text style={styles.mealName}>{meal.food.name}</Text>
                                <Text style={styles.mealDetails}>
                                    {meal.food.calories * meal.servings} cal • 
                                    {meal.food.protein * meal.servings}g protein • 
                                    {meal.food.fat * meal.servings}g fat
                                </Text>
                                <Text style={styles.mealTime}>{meal.timestamp}</Text>
                            </View>
                            <Text style={styles.servings}>x{meal.servings}</Text>
                        </View>
                    ))
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>➕ Add Food</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodScroll}>
                    {carnivoreFoods.map(food => (
                        <TouchableOpacity 
                            key={food.id} 
                            style={styles.foodButton}
                            onPress={() => addMeal(food)}
                        >
                            <Text style={styles.foodName}>{food.name}</Text>
                            <Text style={styles.foodCalories}>{food.calories} cal</Text>
                            <Text style={styles.foodMacros}>{food.protein}g P / {food.fat}g F</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.waterSection}>
                <Text style={styles.sectionTitle}>💧 Water Intake</Text>
                <View style={styles.waterControls}>
                    <TouchableOpacity 
                        style={styles.waterButton}
                        onPress={() => setWaterIntake(prev => Math.max(0, prev - 0.5))}
                    >
                        <Text style={styles.waterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.waterAmount}>{waterIntake} Liters</Text>
                    <TouchableOpacity 
                        style={styles.waterButton}
                        onPress={() => setWaterIntake(prev => prev + 0.5)}
                    >
                        <Text style={styles.waterButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#dc3545',
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'white',
        marginTop: 5,
        opacity: 0.9,
    },
    statsCard: {
        backgroundColor: 'white',
        margin: 15,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#dc3545',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    tipCard: {
        backgroundColor: '#e9ecef',
        margin: 15,
        padding: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    tipText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    section: {
        backgroundColor: 'white',
        margin: 15,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        padding: 20,
    },
    mealItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    mealDetails: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    mealTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    servings: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#dc3545',
    },
    foodScroll: {
        flexDirection: 'row',
    },
    foodButton: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
        minWidth: 120,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    foodName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    foodCalories: {
        fontSize: 12,
        color: '#dc3545',
        marginTop: 5,
    },
    foodMacros: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    waterSection: {
        backgroundColor: 'white',
        margin: 15,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    waterControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterButton: {
        backgroundColor: '#007bff',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    waterAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#333',
    },
});

export default CarnivoreDietApp;
