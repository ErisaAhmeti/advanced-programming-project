import express from "express"
import { Progress } from "../models/Progress"

const router = express.Router()

// GET /api/progress - Get progress entries with optional filters
router.get("/", async (req, res) => {
  try {
    const { userId, startDate, endDate, goalId } = req.query
    console.log("[v0] GET /api/progress - Fetching progress with filters:", {
      userId,
      startDate,
      endDate,
      goalId,
    })

    // Build filter object
    const filter: any = {}
    if (userId) filter.userId = userId
    if (goalId) filter.goalId = goalId
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate as string)
      if (endDate) filter.date.$lte = new Date(endDate as string)
    }

    const progress = await Progress.find(filter)
      .populate("userId", "name email")
      .populate("goalId", "title type")
      .select("-__v")
      .sort({ date: -1 })

    console.log("[v0] Found progress entries:", progress.length)
    res.json(progress)
  } catch (error) {
    console.error("[v0] Error fetching progress:", error)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
})

// GET /api/progress/stats/:userId - Get progress statistics for a user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { days = 30 } = req.query
    console.log("[v0] GET /api/progress/stats/:userId - Fetching stats for user:", userId, "days:", days)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number(days))

    const progressEntries = await Progress.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 })

    // Calculate statistics
    const stats = {
      totalEntries: progressEntries.length,
      averageWeight: 0,
      weightChange: 0,
      averageCalories: 0,
      totalExerciseMinutes: 0,
      averageSleep: 0,
      averageMood: 0,
      averageEnergy: 0,
      weightData: [] as any[],
      calorieData: [] as any[],
    }

    if (progressEntries.length > 0) {
      // Weight statistics
      const weightEntries = progressEntries.filter((p) => p.weight)
      if (weightEntries.length > 0) {
        stats.averageWeight = weightEntries.reduce((sum, p) => sum + p.weight!, 0) / weightEntries.length
        stats.weightChange = weightEntries[weightEntries.length - 1].weight! - weightEntries[0].weight!
        stats.weightData = weightEntries.map((p) => ({
          date: p.date.toISOString().split("T")[0],
          weight: p.weight,
        }))
      }

      // Calorie statistics
      const calorieEntries = progressEntries.filter((p) => p.calories)
      if (calorieEntries.length > 0) {
        stats.averageCalories = calorieEntries.reduce((sum, p) => sum + p.calories!, 0) / calorieEntries.length
        stats.calorieData = calorieEntries.map((p) => ({
          date: p.date.toISOString().split("T")[0],
          calories: p.calories,
        }))
      }

      // Exercise statistics
      const exerciseEntries = progressEntries.filter((p) => p.exerciseMinutes)
      if (exerciseEntries.length > 0) {
        stats.totalExerciseMinutes = exerciseEntries.reduce((sum, p) => sum + p.exerciseMinutes!, 0)
      }

      // Sleep statistics
      const sleepEntries = progressEntries.filter((p) => p.sleep)
      if (sleepEntries.length > 0) {
        stats.averageSleep = sleepEntries.reduce((sum, p) => sum + p.sleep!, 0) / sleepEntries.length
      }

      // Mood statistics
      const moodEntries = progressEntries.filter((p) => p.mood)
      if (moodEntries.length > 0) {
        stats.averageMood = moodEntries.reduce((sum, p) => sum + p.mood!, 0) / moodEntries.length
      }

      // Energy statistics
      const energyEntries = progressEntries.filter((p) => p.energy)
      if (energyEntries.length > 0) {
        stats.averageEnergy = energyEntries.reduce((sum, p) => sum + p.energy!, 0) / energyEntries.length
      }
    }

    console.log("[v0] Calculated stats for user:", userId, stats.totalEntries, "entries")
    res.json(stats)
  } catch (error) {
    console.error("[v0] Error fetching progress stats:", error)
    res.status(500).json({ error: "Failed to fetch progress statistics" })
  }
})

// GET /api/progress/:id - Get progress entry by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("[v0] GET /api/progress/:id - Fetching progress:", req.params.id)
    const progress = await Progress.findById(req.params.id)
      .populate("userId", "name email")
      .populate("goalId", "title type")
      .select("-__v")

    if (!progress) {
      return res.status(404).json({ error: "Progress entry not found" })
    }

    console.log("[v0] Found progress entry for date:", progress.date)
    res.json(progress)
  } catch (error) {
    console.error("[v0] Error fetching progress:", error)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
})

// POST /api/progress - Create new progress entry
router.post("/", async (req, res) => {
  try {
    console.log("[v0] POST /api/progress - Creating progress entry for user:", req.body.userId)
    const progress = new Progress(req.body)
    await progress.save()
    await progress.populate("userId", "name email")
    await progress.populate("goalId", "title type")
    console.log("[v0] Progress entry created successfully:", progress._id)
    res.status(201).json(progress)
  } catch (error) {
    console.error("[v0] Error creating progress:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Failed to create progress entry" })
  }
})

// PUT /api/progress/:id - Update progress entry
router.put("/:id", async (req, res) => {
  try {
    console.log("[v0] PUT /api/progress/:id - Updating progress:", req.params.id)
    const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email")
      .populate("goalId", "title type")
      .select("-__v")

    if (!progress) {
      return res.status(404).json({ error: "Progress entry not found" })
    }

    console.log("[v0] Progress entry updated successfully for date:", progress.date)
    res.json(progress)
  } catch (error) {
    console.error("[v0] Error updating progress:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Failed to update progress entry" })
  }
})

// DELETE /api/progress/:id - Delete progress entry
router.delete("/:id", async (req, res) => {
  try {
    console.log("[v0] DELETE /api/progress/:id - Deleting progress:", req.params.id)
    const progress = await Progress.findByIdAndDelete(req.params.id)

    if (!progress) {
      return res.status(404).json({ error: "Progress entry not found" })
    }

    console.log("[v0] Progress entry deleted successfully for date:", progress.date)
    res.json({ message: "Progress entry deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting progress:", error)
    res.status(500).json({ error: "Failed to delete progress entry" })
  }
})

export default router
