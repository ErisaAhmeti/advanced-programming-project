export interface MealPlan {
  meals: Meal[]
  tips: string[]
}

export interface Meal {
  name: string
  foods: string[]
  calories: number
  protein: number
  carbs: number
  fats: number
}

export function getMealRecommendations(goal: string): MealPlan {
  const baseMeals = {
    breakfast: {
      name: "Mëngjes",
      foods: ["Tërshërë", "Banane", "Kos Grek", "Arra"],
      calories: 400,
      protein: 20,
      carbs: 45,
      fats: 15,
    },
    lunch: {
      name: "Drekë",
      foods: ["Gjoks Pule", "Oriz Integral", "Brokoli", "Vaj Ulliri"],
      calories: 500,
      protein: 35,
      carbs: 50,
      fats: 18,
    },
    dinner: {
      name: "Darkë",
      foods: ["Salmoni", "Patate e Ëmbël", "Spinaq", "Avokado"],
      calories: 450,
      protein: 30,
      carbs: 35,
      fats: 20,
    },
    snack: {
      name: "Snack",
      foods: ["Mollë", "Fruta Pyjore", "Kos"],
      calories: 150,
      protein: 5,
      carbs: 25,
      fats: 3,
    },
  }

  let tips: string[] = []

  if (goal === "lose") {
    tips = [
      "Pini shumë ujë gjatë ditës",
      "Hani më shumë perime dhe fruta",
      "Shmangni ushqimet e përpunuara",
      "Kontrolloni porcionet",
    ]
  } else if (goal === "gain") {
    tips = [
      "Shtoni proteina në çdo vakt",
      "Hani më shpesh (5-6 vakte në ditë)",
      "Përfshini yndyrna të shëndetshme",
      "Pini smoothie me proteina",
    ]
  } else {
    tips = [
      "Mbani një dietë të balancuar",
      "Hani në orare të rregullta",
      "Përfshini të gjitha grupet e ushqimeve",
      "Moderoni ëmbëlsirat",
    ]
  }

  return {
    meals: Object.values(baseMeals),
    tips,
  }
}
