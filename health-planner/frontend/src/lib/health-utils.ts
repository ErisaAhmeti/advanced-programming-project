export interface UserProfile {
  age: number
  weight: number // kg
  height: number // cm
  gender: "male" | "female"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active"
  goal: "weight-loss" | "weight-gain" | "maintenance" | "muscle-gain"
}

export interface CalorieResult {
  bmr: number // Basal Metabolic Rate
  tdee: number // Total Daily Energy Expenditure
  targetCalories: number // Adjusted for goal
  protein: number // grams
  carbs: number // grams
  fat: number // grams
}

// Calculate BMR using Mifflin-St Jeor Equation
export function calculateBMR(weight: number, height: number, age: number, gender: "male" | "female"): number {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

export function getActivityMultiplier(activityLevel: UserProfile["activityLevel"]): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  }

  return activityMultipliers[activityLevel]
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: UserProfile["activityLevel"]): number {
  return bmr * getActivityMultiplier(activityLevel)
}

// Calculate BMI
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}
