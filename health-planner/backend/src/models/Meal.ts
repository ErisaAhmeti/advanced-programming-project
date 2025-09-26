import mongoose, { type Document, Schema } from "mongoose"

export interface IFood {
  name: string
  quantity: number
  unit: string // grams, cups, pieces, etc.
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface IMeal extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  foods: IFood[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  date: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const FoodSchema = new Schema<IFood>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  protein: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  carbs: {
    type: Number,
    required: true,
    min: 0,
    max: 2000,
  },
  fat: {
    type: Number,
    required: true,
    min: 0,
    max: 500,
  },
  fiber: {
    type: Number,
    min: 0,
    max: 200,
  },
  sugar: {
    type: Number,
    min: 0,
    max: 500,
  },
  sodium: {
    type: Number,
    min: 0,
    max: 10000, // mg
  },
})

const MealSchema = new Schema<IMeal>(
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
      enum: ["breakfast", "lunch", "dinner", "snack"],
    },
    foods: [FoodSchema],
    totalCalories: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    totalProtein: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    totalCarbs: {
      type: Number,
      required: true,
      min: 0,
      max: 2000,
    },
    totalFat: {
      type: Number,
      required: true,
      min: 0,
      max: 500,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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
MealSchema.index({ userId: 1, date: -1 })
MealSchema.index({ userId: 1, type: 1 })
MealSchema.index({ userId: 1, date: 1, type: 1 })

// Pre-save middleware to calculate totals
MealSchema.pre("save", function (next) {
  this.totalCalories = this.foods.reduce((sum, food) => sum + food.calories, 0)
  this.totalProtein = this.foods.reduce((sum, food) => sum + food.protein, 0)
  this.totalCarbs = this.foods.reduce((sum, food) => sum + food.carbs, 0)
  this.totalFat = this.foods.reduce((sum, food) => sum + food.fat, 0)
  next()
})

export const Meal = mongoose.model<IMeal>("Meal", MealSchema)
