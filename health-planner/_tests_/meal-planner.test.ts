import { generateMealPlan, getMealRecommendations } from "../lib/meal-planner"

describe("Meal Planner", () => {
  describe("generateMealPlan", () => {
    test("should generate meal plan for weight loss", () => {
      const mealPlan = generateMealPlan(1800, "weight_loss")

      expect(mealPlan).toHaveLength(3) // breakfast, lunch, dinner
      expect(mealPlan[0].type).toBe("breakfast")
      expect(mealPlan[1].type).toBe("lunch")
      expect(mealPlan[2].type).toBe("dinner")

      // Check total calories are approximately correct
      const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0)
      expect(totalCalories).toBeCloseTo(1800, 100)
    })

    test("should generate meal plan for muscle gain", () => {
      const mealPlan = generateMealPlan(2500, "muscle_gain")

      expect(mealPlan).toHaveLength(3)

      const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0)
      expect(totalCalories).toBeCloseTo(2500, 100)
    })
  })

  describe("getMealRecommendations", () => {
    test("should return breakfast recommendations", () => {
      const recommendations = getMealRecommendations("breakfast", 500)

      expect(recommendations).toHaveLength(3)
      recommendations.forEach((meal) => {
        expect(meal.calories).toBeLessThanOrEqual(600) // Allow some flexibility
        expect(meal.calories).toBeGreaterThanOrEqual(400)
      })
    })

    test("should return lunch recommendations", () => {
      const recommendations = getMealRecommendations("lunch", 700)

      expect(recommendations).toHaveLength(3)
      recommendations.forEach((meal) => {
        expect(meal.calories).toBeLessThanOrEqual(800)
        expect(meal.calories).toBeGreaterThanOrEqual(600)
      })
    })
  })
})
