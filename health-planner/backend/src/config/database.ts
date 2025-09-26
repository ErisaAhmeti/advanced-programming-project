import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/health-planner"

export async function connectDatabase() {
  try {
    console.log("[v0] Connecting to MongoDB:", MONGODB_URI)
    await mongoose.connect(MONGODB_URI)
    console.log("[v0] MongoDB connected successfully")
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    process.exit(1)
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect()
    console.log("[v0] MongoDB disconnected")
  } catch (error) {
    console.error("[v0] MongoDB disconnection error:", error)
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("[v0] Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("[v0] Mongoose connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("[v0] Mongoose disconnected")
})

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDatabase()
  process.exit(0)
})
