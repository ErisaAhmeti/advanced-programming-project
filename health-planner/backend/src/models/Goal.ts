import mongoose, { type Document, Schema } from "mongoose"

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  type: "weight" | "exercise" | "nutrition" | "habit"
  targetValue: number
  currentValue: number
  unit: string // kg, minutes, calories, etc.
  targetDate?: Date
  status: "active" | "completed" | "paused" | "cancelled"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      required: true,
      enum: ["weight", "exercise", "nutrition", "habit"],
    },
    targetValue: {
      type: Number,
      required: true,
      min: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    targetDate: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "completed", "paused", "cancelled"],
    },
    priority: {
      type: String,
      default: "medium",
      enum: ["low", "medium", "high"],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
GoalSchema.index({ userId: 1, status: 1 })
GoalSchema.index({ userId: 1, type: 1 })
GoalSchema.index({ targetDate: 1 })
GoalSchema.index({ createdAt: -1 })

// Virtual for progress percentage
GoalSchema.virtual("progressPercentage").get(function () {
  if (this.targetValue === 0) return 0
  return Math.min(100, (this.currentValue / this.targetValue) * 100)
})

export const Goal = mongoose.model<IGoal>("Goal", GoalSchema)
