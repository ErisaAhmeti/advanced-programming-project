import mongoose, { type Document, Schema } from "mongoose"

export interface IExercise {
  name: string
  sets?: number
  reps?: number
  weight?: number // kg
  duration?: number // minutes
  distance?: number // km
  calories?: number
  notes?: string
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  type: "strength" | "cardio" | "flexibility" | "sports" | "mixed"
  duration: number // minutes
  exercises: IExercise[]
  totalCalories?: number
  difficulty: "beginner" | "intermediate" | "advanced"
  date: Date
  completed: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ExerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  sets: {
    type: Number,
    min: 1,
    max: 50,
  },
  reps: {
    type: Number,
    min: 1,
    max: 1000,
  },
  weight: {
    type: Number,
    min: 0,
    max: 1000,
  },
  duration: {
    type: Number,
    min: 0,
    max: 1440, // 24 hours in minutes
  },
  distance: {
    type: Number,
    min: 0,
    max: 1000, // km
  },
  calories: {
    type: Number,
    min: 0,
    max: 5000,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
})

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      required: true,
      enum: ["strength", "cardio", "flexibility", "sports", "mixed"],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 1440, // 24 hours in minutes
    },
    exercises: [ExerciseSchema],
    totalCalories: {
      type: Number,
      min: 0,
      max: 5000,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
WorkoutSchema.index({ userId: 1, date: -1 })
WorkoutSchema.index({ userId: 1, type: 1 })
WorkoutSchema.index({ userId: 1, completed: 1 })

export const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema)
