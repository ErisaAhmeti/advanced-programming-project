import { calculateBMR, calculateTDEE, calculateMacros, getActivityMultiplier } from "../lib/health-utils"

describe("Health Utils", () => {
  describe("calculateBMR", () => {
    test("should calculate BMR for male correctly", () => {
      const bmr = calculateBMR(80, 180, 25, "male")
      expect(bmr).toBeCloseTo(1847.5, 1)
    })

    test("should calculate BMR for female correctly", () => {
      const bmr = calculateBMR(65, 165, 30, "female")
      expect(bmr).toBeCloseTo(1379.5, 1)
    })
  })

  describe("calculateTDEE", () => {
    test("should calculate TDEE with sedentary activity", () => {
      const bmr = 1500
      const tdee = calculateTDEE(bmr, "sedentary")
      expect(tdee).toBe(1800) // 1500 * 1.2
    })

    test("should calculate TDEE with very active lifestyle", () => {
      const bmr = 1500
      const tdee = calculateTDEE(bmr, "very_active")
      expect(tdee).toBe(2325) // 1500 * 1.55
    })
  })

  describe("calculateMacros", () => {
    test("should calculate macros for weight loss", () => {
      const macros = calculateMacros(2000, "weight_loss")
      expect(macros.protein).toBe(150) // 30% of 2000 calories / 4
      expect(macros.carbs).toBe(175) // 35% of 2000 calories / 4
      expect(macros.fat).toBe(78) // 35% of 2000 calories / 9
    })

    test("should calculate macros for muscle gain", () => {
      const macros = calculateMacros(2500, "muscle_gain")
      expect(macros.protein).toBe(188) // 30% of 2500 calories / 4
      expect(macros.carbs).toBe(281) // 45% of 2500 calories / 4
      expect(macros.fat).toBe(69) // 25% of 2500 calories / 9
    })
  })

  describe("getActivityMultiplier", () => {
    test("should return correct multipliers", () => {
      expect(getActivityMultiplier("sedentary")).toBe(1.2)
      expect(getActivityMultiplier("lightly_active")).toBe(1.375)
      expect(getActivityMultiplier("moderately_active")).toBe(1.55)
      expect(getActivityMultiplier("very_active")).toBe(1.725)
      expect(getActivityMultiplier("extremely_active")).toBe(1.9)
    })
  })
})
