// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the health-planner database using getSiblingDB
var healthPlannerDB = db.getSiblingDB("health-planner")

// Declare the db variable
var db = db

// Create collections with validation
healthPlannerDB.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "age", "gender", "height", "weight", "activityLevel"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        age: { bsonType: "number", minimum: 1, maximum: 120 },
        gender: { enum: ["male", "female", "other"] },
        height: { bsonType: "number", minimum: 50, maximum: 300 },
        weight: { bsonType: "number", minimum: 20, maximum: 500 },
        activityLevel: {
          enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"],
        },
        healthConditions: { bsonType: "array" },
        allergies: { bsonType: "array" },
        dietaryPreferences: { bsonType: "array" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
})

healthPlannerDB.createCollection("goals")
healthPlannerDB.createCollection("progress")
healthPlannerDB.createCollection("workouts")
healthPlannerDB.createCollection("meals")

// Create indexes for better performance
healthPlannerDB.users.createIndex({ email: 1 }, { unique: true })
healthPlannerDB.goals.createIndex({ userId: 1, status: 1 })
healthPlannerDB.progress.createIndex({ userId: 1, date: -1 })
healthPlannerDB.progress.createIndex({ goalId: 1, date: -1 })
healthPlannerDB.workouts.createIndex({ userId: 1, date: -1 })
healthPlannerDB.meals.createIndex({ userId: 1, date: -1, type: 1 })

// Insert sample data for testing
var sampleUser = {
  name: "Test User",
  email: "test@example.com",
  age: 25,
  gender: "male",
  height: 175,
  weight: 70,
  activityLevel: "moderately_active",
  healthConditions: [],
  allergies: [],
  dietaryPreferences: ["vegetarian"],
  createdAt: new Date(),
  updatedAt: new Date(),
}

var insertedUser = healthPlannerDB.users.insertOne(sampleUser)
var userId = insertedUser.insertedId

// Sample goal
healthPlannerDB.goals.insertOne({
  userId: userId,
  type: "weight_loss",
  title: "Humbje peshe 5 kg",
  description: "Dua të humbas 5 kg në 3 muaj",
  targetValue: 65,
  currentValue: 70,
  unit: "kg",
  targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
  status: "active",
  priority: "high",
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Sample progress entry
healthPlannerDB.progress.insertOne({
  userId: userId,
  date: new Date(),
  weight: 70,
  workoutCompleted: true,
  workoutDuration: 45,
  caloriesConsumed: 2000,
  waterIntake: 2500,
  sleepHours: 8,
  mood: "good",
  energyLevel: 4,
  notes: "Ditë e mirë, stërvitje intensive",
  createdAt: new Date(),
  updatedAt: new Date(),
})

print("MongoDB initialized successfully with sample data!")
