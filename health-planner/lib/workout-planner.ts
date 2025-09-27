import type { UserProfile, Exercise } from "./health-utils"
import { exerciseDatabase } from "./health-utils"

export interface WorkoutExercise {
  exercise: Exercise
  duration: number // minutes
  estimatedCalories: number
}

export interface Workout {
  name: string
  exercises: WorkoutExercise[]
  duration: number // total minutes
  estimatedCalories: number
  focus: string
}

export interface WorkoutPlan {
  workouts: Workout[]
  sessionsPerWeek: number
  sessionDuration: number
  totalExercises: number
}

// Get exercises by category and difficulty
function getExercisesByCategory(category: Exercise["category"], maxDifficulty?: Exercise["difficulty"]): Exercise[] {
  return exerciseDatabase.filter((exercise) => {
    if (exercise.category !== category) return false
    if (!maxDifficulty) return true

    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
    return difficultyOrder[exercise.difficulty] <= difficultyOrder[maxDifficulty]
  })
}

// Select random exercises from a list
function selectRandomExercises(exercises: Exercise[], count: number): Exercise[] {
  const shuffled = [...exercises].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Generate a workout based on focus and duration
function generateWorkout(name: string, focus: string, targetDuration: number, userProfile: UserProfile): Workout {
  const exercises: WorkoutExercise[] = []
  let totalDuration = 0
  let totalCalories = 0

  // Determine max difficulty based on activity level
  let maxDifficulty: Exercise["difficulty"] = "beginner"
  if (userProfile.activityLevel === "moderate" || userProfile.activityLevel === "active") {
    maxDifficulty = "intermediate"
  } else if (userProfile.activityLevel === "very-active") {
    maxDifficulty = "advanced"
  }

  // Generate exercises based on focus
  if (focus === "Kardio dhe Humbje Peshe") {
    const cardioExercises = getExercisesByCategory("cardio", maxDifficulty)
    const selectedCardio = selectRandomExercises(cardioExercises, 3)

    for (const exercise of selectedCardio) {
      const duration = Math.round(targetDuration / 3)
      const calories = exercise.caloriesPerMinute * duration
      exercises.push({
        exercise,
        duration,
        estimatedCalories: calories,
      })
      totalDuration += duration
      totalCalories += calories
    }
  } else if (focus === "Forcë dhe Muskuj") {
    const strengthExercises = getExercisesByCategory("strength", maxDifficulty)
    const selectedStrength = selectRandomExercises(strengthExercises, 4)

    for (const exercise of selectedStrength) {
      const duration = Math.round(targetDuration / 4)
      const calories = exercise.caloriesPerMinute * duration
      exercises.push({
        exercise,
        duration,
        estimatedCalories: calories,
      })
      totalDuration += duration
      totalCalories += calories
    }
  } else if (focus === "Fleksibilitet dhe Relaksim") {
    const flexibilityExercises = getExercisesByCategory("flexibility", maxDifficulty)
    const selectedFlex = selectRandomExercises(flexibilityExercises, 2)

    for (const exercise of selectedFlex) {
      const duration = Math.round(targetDuration / 2)
      const calories = exercise.caloriesPerMinute * duration
      exercises.push({
        exercise,
        duration,
        estimatedCalories: calories,
      })
      totalDuration += duration
      totalCalories += calories
    }
  } else if (focus === "Sport dhe Argëtim") {
    const sportsExercises = getExercisesByCategory("sports", maxDifficulty)
    const selectedSports = selectRandomExercises(sportsExercises, 2)

    for (const exercise of selectedSports) {
      const duration = Math.round(targetDuration / 2)
      const calories = exercise.caloriesPerMinute * duration
      exercises.push({
        exercise,
        duration,
        estimatedCalories: calories,
      })
      totalDuration += duration
      totalCalories += calories
    }
  } else {
    // Mixed workout
    const cardio = selectRandomExercises(getExercisesByCategory("cardio", maxDifficulty), 1)
    const strength = selectRandomExercises(getExercisesByCategory("strength", maxDifficulty), 2)
    const flexibility = selectRandomExercises(getExercisesByCategory("flexibility", maxDifficulty), 1)

    const allExercises = [...cardio, ...strength, ...flexibility]
    for (const exercise of allExercises) {
      const duration = Math.round(targetDuration / allExercises.length)
      const calories = exercise.caloriesPerMinute * duration
      exercises.push({
        exercise,
        duration,
        estimatedCalories: calories,
      })
      totalDuration += duration
      totalCalories += calories
    }
  }

  return {
    name,
    exercises,
    duration: totalDuration,
    estimatedCalories: totalCalories,
    focus,
  }
}

export function generateWorkoutPlan(userProfile: UserProfile): WorkoutPlan {
  const workouts: Workout[] = []
  let sessionsPerWeek: number
  let sessionDuration: number

  // Determine workout frequency and duration based on activity level and goals
  switch (userProfile.activityLevel) {
    case "sedentary":
      sessionsPerWeek = 2
      sessionDuration = 20
      break
    case "light":
      sessionsPerWeek = 3
      sessionDuration = 30
      break
    case "moderate":
      sessionsPerWeek = 4
      sessionDuration = 40
      break
    case "active":
      sessionsPerWeek = 5
      sessionDuration = 45
      break
    case "very-active":
      sessionsPerWeek = 6
      sessionDuration = 60
      break
    default:
      sessionsPerWeek = 3
      sessionDuration = 30
  }

  // Generate workouts based on goals
  if (userProfile.goal === "weight-loss") {
    // Focus on cardio and high-intensity workouts
    workouts.push(
      generateWorkout("Seanca 1", "Kardio dhe Humbje Peshe", sessionDuration, userProfile),
      generateWorkout("Seanca 2", "Kardio dhe Humbje Peshe", sessionDuration, userProfile),
      generateWorkout("Seanca 3", "Forcë dhe Muskuj", sessionDuration, userProfile),
    )

    if (sessionsPerWeek >= 4) {
      workouts.push(generateWorkout("Seanca 4", "Kardio dhe Humbje Peshe", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 5) {
      workouts.push(generateWorkout("Seanca 5", "Fleksibilitet dhe Relaksim", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 6) {
      workouts.push(generateWorkout("Seanca 6", "Sport dhe Argëtim", sessionDuration, userProfile))
    }
  } else if (userProfile.goal === "muscle-gain") {
    // Focus on strength training
    workouts.push(
      generateWorkout("Seanca 1", "Forcë dhe Muskuj", sessionDuration, userProfile),
      generateWorkout("Seanca 2", "Forcë dhe Muskuj", sessionDuration, userProfile),
      generateWorkout("Seanca 3", "Forcë dhe Muskuj", sessionDuration, userProfile),
    )

    if (sessionsPerWeek >= 4) {
      workouts.push(generateWorkout("Seanca 4", "Kardio dhe Humbje Peshe", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 5) {
      workouts.push(generateWorkout("Seanca 5", "Forcë dhe Muskuj", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 6) {
      workouts.push(generateWorkout("Seanca 6", "Fleksibilitet dhe Relaksim", sessionDuration, userProfile))
    }
  } else if (userProfile.goal === "weight-gain") {
    // Moderate strength training with some cardio
    workouts.push(
      generateWorkout("Seanca 1", "Forcë dhe Muskuj", sessionDuration, userProfile),
      generateWorkout("Seanca 2", "Forcë dhe Muskuj", sessionDuration, userProfile),
    )

    if (sessionsPerWeek >= 3) {
      workouts.push(generateWorkout("Seanca 3", "Kardio dhe Humbje Peshe", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 4) {
      workouts.push(generateWorkout("Seanca 4", "Forcë dhe Muskuj", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 5) {
      workouts.push(generateWorkout("Seanca 5", "Sport dhe Argëtim", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 6) {
      workouts.push(generateWorkout("Seanca 6", "Fleksibilitet dhe Relaksim", sessionDuration, userProfile))
    }
  } else {
    // Maintenance - balanced approach
    workouts.push(
      generateWorkout("Seanca 1", "Kardio dhe Humbje Peshe", sessionDuration, userProfile),
      generateWorkout("Seanca 2", "Forcë dhe Muskuj", sessionDuration, userProfile),
    )

    if (sessionsPerWeek >= 3) {
      workouts.push(generateWorkout("Seanca 3", "Fleksibilitet dhe Relaksim", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 4) {
      workouts.push(generateWorkout("Seanca 4", "Sport dhe Argëtim", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 5) {
      workouts.push(generateWorkout("Seanca 5", "Kardio dhe Humbje Peshe", sessionDuration, userProfile))
    }
    if (sessionsPerWeek >= 6) {
      workouts.push(generateWorkout("Seanca 6", "Forcë dhe Muskuj", sessionDuration, userProfile))
    }
  }

  // Calculate total exercises
  const totalExercises = workouts.reduce((total, workout) => total + workout.exercises.length, 0)

  return {
    workouts: workouts.slice(0, sessionsPerWeek),
    sessionsPerWeek,
    sessionDuration,
    totalExercises,
  }
}
