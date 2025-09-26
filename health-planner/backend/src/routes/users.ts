import express from "express"
import { User } from "../models/User"

const router = express.Router()

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    console.log("[v0] GET /api/users - Fetching all users")
    const users = await User.find().select("-__v").sort({ createdAt: -1 })
    console.log("[v0] Found users:", users.length)
    res.json(users)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// GET /api/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("[v0] GET /api/users/:id - Fetching user:", req.params.id)
    const user = await User.findById(req.params.id).select("-__v")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    console.log("[v0] Found user:", user.name)
    res.json(user)
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// POST /api/users - Create new user
router.post("/", async (req, res) => {
  try {
    console.log("[v0] POST /api/users - Creating user:", req.body.name)
    const user = new User(req.body)
    await user.save()
    console.log("[v0] User created successfully:", user._id)
    res.status(201).json(user)
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" })
    }
    res.status(500).json({ error: "Failed to create user" })
  }
})

// PUT /api/users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    console.log("[v0] PUT /api/users/:id - Updating user:", req.params.id)
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    console.log("[v0] User updated successfully:", user.name)
    res.json(user)
  } catch (error) {
    console.error("[v0] Error updating user:", error)
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: "Failed to update user" })
  }
})

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    console.log("[v0] DELETE /api/users/:id - Deleting user:", req.params.id)
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    console.log("[v0] User deleted successfully:", user.name)
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
})

export default router
