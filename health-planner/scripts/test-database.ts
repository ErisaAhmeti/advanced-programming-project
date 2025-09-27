// Test script to verify MongoDB connection and basic operations
import { connectDB, disconnectDB } from "../server/config/database"
import User from "../server/models/User"
import Goal from "../server/models/Goal"
import Progress from "../server/models/Progress"

async function testDatabase() {
  try {
    console.log("[v0] Starting database tests...")

    // Connect to database
    await connectDB()
    console.log("[v0] ✅ Database connection successful")

    // Test User creation
    const testUser = new User({
      name: "Test User",
      email: "test@healthplanner.com",
      age: 28,
      gender: "male",
      height: 180,
      weight: 75,
      activityLevel: "moderately_active",
      healthConditions: ["none"],
      allergies: [],
      dietaryPreferences: ["balanced"],
    })

    const savedUser = await testUser.save()
    console.log("[v0] ✅ User creation successful:", savedUser.name)

    // Test Goal creation
    const testGoal = new Goal({
      userId: savedUser._id,
      type: "weight_loss",
      title: "Test Goal",
      description: "Test goal description",
      targetValue: 70,
      currentValue: 75,
      unit: "kg",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "active",
      priority: "medium",
    })

    const savedGoal = await testGoal.save()
    console.log("[v0] ✅ Goal creation successful:", savedGoal.title)

    // Test Progress creation
    const testProgress = new Progress({
      userId: savedUser._id,
      goalId: savedGoal._id,
      date: new Date(),
      weight: 74,
      workoutCompleted: true,
      workoutDuration: 30,
      caloriesConsumed: 2000,
      waterIntake: 2000,
      sleepHours: 8,
      mood: "good",
      energyLevel: 4,
      notes: "Test progress entry",
    })

    const savedProgress = await testProgress.save()
    console.log("[v0] ✅ Progress creation successful")

    // Test queries
    const users = await User.find()
    const goals = await Goal.find().populate("userId")
    const progress = await Progress.find().populate("userId").populate("goalId")

    console.log("[v0] ✅ Query tests successful:")
    console.log(`  - Users: ${users.length}`)
    console.log(`  - Goals: ${goals.length}`)
    console.log(`  - Progress entries: ${progress.length}`)

    // Clean up test data
    await User.findByIdAndDelete(savedUser._id)
    await Goal.findByIdAndDelete(savedGoal._id)
    await Progress.findByIdAndDelete(savedProgress._id)
    console.log("[v0] ✅ Test data cleanup successful")

    console.log("[v0] 🎉 All database tests passed!")
  } catch (error) {
    console.error("[v0] ❌ Database test failed:", error)
    process.exit(1)
  } finally {
    await disconnectDB()
  }
}

// Run tests
testDatabase()
