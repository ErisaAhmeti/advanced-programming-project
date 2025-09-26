import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  age: number
  weight: number // kg
  height: number // cm
  gender: "male" | "female"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active"
  goal: "weight-loss" | "weight-gain" | "maintenance" | "muscle-gain"
  targetWeight?: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
    },
    weight: {
      type: Number,
      required: true,
      min: 20,
      max: 500,
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    activityLevel: {
      type: String,
      required: true,
      enum: ["sedentary", "light", "moderate", "active", "very-active"],
    },
    goal: {
      type: String,
      required: true,
      enum: ["weight-loss", "weight-gain", "maintenance", "muscle-gain"],
    },
    targetWeight: {
      type: Number,
      min: 20,
      max: 500,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })

export const User = mongoose.model<IUser>("User", UserSchema)
