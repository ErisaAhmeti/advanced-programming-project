import mongoose, { type Document, Schema } from "mongoose"

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId
  goalId?: mongoose.Types.ObjectId
  date: Date
  weight?: number
  bodyFat?: number
  muscleMass?: number
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  water?: number // liters
  sleep?: number // hours
  steps?: number
  exerciseMinutes?: number
  mood?: number // 1-10 scale
  energy?: number // 1-10 scale
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weight: {
      type: Number,
      min: 20,
      max: 500,
    },
    bodyFat: {
      type: Number,
      min: 0,
      max: 100,
    },
    muscleMass: {
      type: Number,
      min: 0,
      max: 200,
    },
    calories: {
      type: Number,
      min: 0,
      max: 10000,
    },
    protein: {
      type: Number,
      min: 0,
      max: 1000,
    },
    carbs: {
      type: Number,
      min: 0,
      max: 2000,
    },
    fat: {
      type: Number,
      min: 0,
      max: 500,
    },
    water: {
      type: Number,
      min: 0,
      max: 20,
    },
    sleep: {
      type: Number,
      min: 0,
      max: 24,
    },
    steps: {
      type: Number,
      min: 0,
      max: 100000,
    },
    exerciseMinutes: {
      type: Number,
      min: 0,
      max: 1440, // 24 hours
    },
    mood: {
      type: Number,
      min: 1,
      max: 10,
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
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
ProgressSchema.index({ userId: 1, date: -1 })
ProgressSchema.index({ goalId: 1, date: -1 })
ProgressSchema.index({ userId: 1, goalId: 1, date: -1 })

// Compound index for date range queries
ProgressSchema.index({ userId: 1, date: 1 })

export const Progress = mongoose.model<IProgress>("Progress", ProgressSchema)
