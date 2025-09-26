import { describe, test, expect } from "vitest"
import { generateMealPlan, getMealRecommendations } from "../lib/meal-planner"

describe("Meal Planner", () => {
  describe("generateMealPlan", () => {
    test("should generate meal plan for weight loss", () => {
      const mealPlan = generateMealPlan(1800, "weight-loss")

      expect(mealPlan).toHaveLength(3) // breakfast, lunch, dinner
      expect(mealPlan[0].type).toBe("breakfast")
      expect(mealPlan[1].type).toBe("lunch")
      expect(mealPlan[2].type).toBe("dinner")

      // Check total calories are approximately correct
      const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0)
      expect(totalCalories).toBeCloseTo(1800, 200)
    })

    test("should generate meal plan for muscle gain", () => {
      const mealPlan = generateMealPlan(2500, "muscle-gain")

      expect(mealPlan).toHaveLength(3)

      const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0)
      expect(totalCalories).toBeCloseTo(2500, 200)
    })
  })

  describe("getMealRecommendations", () => {
    test("should return breakfast recommendations", () => {
      const recommendations = getMealRecommendations("breakfast", 500)

      expect(recommendations).toHaveLength(3)
      recommendations.forEach((meal) => {
        expect(meal.calories).toBeLessThanOrEqual(700) // Allow some flexibility
        expect(meal.calories).toBeGreaterThanOrEqual(300)
      })
    })

    test("should return lunch recommendations", () => {
      const recommendations = getMealRecommendations("lunch", 700)

      expect(recommendations).toHaveLength(3)
      recommendations.forEach((meal) => {
        expect(meal.calories).toBeLessThanOrEqual(900)
        expect(meal.calories).toBeGreaterThanOrEqual(500)
      })
    })
  })
})
