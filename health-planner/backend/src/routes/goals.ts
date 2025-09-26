import express from "express"
import { Goal } from "../models/Goal"

const router = express.Router()

// GET /api/goals - Get all goals (with optional userId filter)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query
    console.log("[v0] GET /api/goals - Fetching goals for user:", userId || "all")

    const filter = userId ? { userId } : {}
    const goals = await Goal.find(filter).populate("userId", "name email").select("-__v").sort({ createdAt: -1 })

    console.log("[v0] Found goals:", goals.length)
    res.json(goals)
  } catch (error) {
    console.error("[v0] Error fetching goals:", error)
    res.status(500).json({ error: "Failed to fetch goals" })
  }
})

// GET /api/goals/:id - Get goal by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("[v0] GET /api/goals/:id - Fetching goal:", req.params.id)
    const goal = await Goal.findById(req.params.id).populate("userId", "name email").select("-__v")

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" })
    }

    console.log("[v0] Found goal:", goal.title)
    res.json(goal)
  } catch (error) {
    console.error("[v0] Error fetching goal:", error)
    res.status(500).json({ error: "Failed to fetch goal" })
  }
})

// POST /api/goals - Create new goal
router.post("/", async (req, res) => {
  try {
    console.log("[v0] POST /api/goals - Creating goal:", req.body.title)
    const goal = new Goal(req.body)
    await goal.save()
    await goal.populate("userId", "name email")
    console.log("[v0] Goal created successfully:", goal._id)
    res.status(201).json(goal)
  } catch (error) {
    console.error("[v0] Error creating goal:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Failed to create goal" })
  }
})

// PUT /api/goals/:id - Update goal
router.put("/:id", async (req, res) => {
  try {
    console.log("[v0] PUT /api/goals/:id - Updating goal:", req.params.id)
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email")
      .select("-__v")

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" })
    }

    console.log("[v0] Goal updated successfully:", goal.title)
    res.json(goal)
  } catch (error) {
    console.error("[v0] Error updating goal:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Failed to update goal" })
  }
})

// PATCH /api/goals/:id/progress - Update goal progress
router.patch("/:id/progress", async (req, res) => {
  try {
    const { currentValue } = req.body
    console.log("[v0] PATCH /api/goals/:id/progress - Updating progress:", req.params.id, currentValue)

    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { currentValue },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "name email")
      .select("-__v")

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" })
    }

    // Check if goal is completed
    if (goal.currentValue >= goal.targetValue && goal.status === "active") {
      goal.status = "completed"
      await goal.save()
    }

    console.log("[v0] Goal progress updated:", goal.title, `${goal.currentValue}/${goal.targetValue}`)
    res.json(goal)
  } catch (error) {
    console.error("[v0] Error updating goal progress:", error)
    res.status(500).json({ error: "Failed to update goal progress" })
  }
})

// DELETE /api/goals/:id - Delete goal
router.delete("/:id", async (req, res) => {
  try {
    console.log("[v0] DELETE /api/goals/:id - Deleting goal:", req.params.id)
    const goal = await Goal.findByIdAndDelete(req.params.id)

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" })
    }

    console.log("[v0] Goal deleted successfully:", goal.title)
    res.json({ message: "Goal deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting goal:", error)
    res.status(500).json({ error: "Failed to delete goal" })
  }
})

export default router
