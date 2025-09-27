// Script to seed the database with sample data
import { connectDB, disconnectDB } from "../server/config/database"
import User from "../server/models/User"
import Goal from "../server/models/Goal"
import Progress from "../server/models/Progress"

async function seedDatabase() {
  try {
    console.log("[v0] Starting database seeding...")

    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Goal.deleteMany({})
    await Progress.deleteMany({})
    console.log("[v0] Cleared existing data")

    // Create sample users
    const users = await User.insertMany([
      {
        name: "Arben Krasniqi",
        email: "arben@example.com",
        age: 30,
        gender: "male",
        height: 175,
        weight: 80,
        activityLevel: "moderately_active",
        healthConditions: [],
        allergies: [],
        dietaryPreferences: ["balanced"],
      },
      {
        name: "Drita Hoxha",
        email: "drita@example.com",
        age: 25,
        gender: "female",
        height: 165,
        weight: 60,
        activityLevel: "very_active",
        healthConditions: [],
        allergies: ["nuts"],
        dietaryPreferences: ["vegetarian"],
      },
      {
        name: "Besnik Rama",
        email: "besnik@example.com",
        age: 35,
        gender: "male",
        height: 180,
        weight: 90,
        activityLevel: "lightly_active",
        healthConditions: ["diabetes"],
        allergies: [],
        dietaryPreferences: ["low_carb"],
      },
    ])

    console.log("[v0] ✅ Created sample users:", users.length)

    // Create sample goals
    const goals = []
    for (const user of users) {
      const userGoals = await Goal.insertMany([
        {
          userId: user._id,
          type: "weight_loss",
          title: "Humbje peshe",
          description: "Dua të humbas peshë për shëndet më të mirë",
          targetValue: user.weight - 5,
          currentValue: user.weight,
          unit: "kg",
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          status: "active",
          priority: "high",
        },
        {
          userId: user._id,
          type: "endurance",
          title: "Përmirësim i qëndrueshmërisë",
          description: "Dua të mund të vrapoj për 30 minuta pa u lodhur",
          targetValue: 30,
          currentValue: 10,
          unit: "minuta",
          targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          status: "active",
          priority: "medium",
        },
      ])
      goals.push(...userGoals)
    }

    console.log("[v0] ✅ Created sample goals:", goals.length)

    // Create sample progress entries
    const progressEntries = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      for (const user of users) {
        const userGoal = goals.find((g) => g.userId.toString() === user._id.toString())

        const progress = new Progress({
          userId: user._id,
          goalId: userGoal?._id,
          date: date,
          weight: user.weight - Math.random() * 2,
          workoutCompleted: Math.random() > 0.3,
          workoutDuration: Math.floor(Math.random() * 60) + 15,
          caloriesConsumed: Math.floor(Math.random() * 500) + 1800,
          waterIntake: Math.floor(Math.random() * 1000) + 2000,
          sleepHours: Math.floor(Math.random() * 3) + 6,
          mood: ["excellent", "good", "average", "poor"][Math.floor(Math.random() * 4)],
          energyLevel: Math.floor(Math.random() * 5) + 1,
          notes: i === 0 ? "Ditë e sotme - ndihem mirë!" : `Ditë ${i + 1} më parë`,
        })

        progressEntries.push(progress)
      }
    }

    await Progress.insertMany(progressEntries)
    console.log("[v0] ✅ Created sample progress entries:", progressEntries.length)

    console.log("[v0] 🎉 Database seeding completed successfully!")
    console.log("[v0] Sample data:")
    console.log(`  - Users: ${users.length}`)
    console.log(`  - Goals: ${goals.length}`)
    console.log(`  - Progress entries: ${progressEntries.length}`)
  } catch (error) {
    console.error("[v0] ❌ Database seeding failed:", error)
    process.exit(1)
  } finally {
    await disconnectDB()
  }
}

// Run seeding
seedDatabase()
