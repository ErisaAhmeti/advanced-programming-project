"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Dumbbell, Clock, Zap, Target, Play, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { UserProfile, Exercise } from "@/lib/health-utils"
import { exerciseDatabase } from "@/lib/health-utils"
import { generateWorkoutPlan, type WorkoutPlan } from "@/lib/workout-planner"

export default function ExercisesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as UserProfile
      setProfile(parsedProfile)

      const generatedWorkoutPlan = generateWorkoutPlan(parsedProfile)
      setWorkoutPlan(generatedWorkoutPlan)
    }
    setLoading(false)
  }, [])

  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises)
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId)
    } else {
      newCompleted.add(exerciseId)
    }
    setCompletedExercises(newCompleted)
  }

  const getCategoryIcon = (category: Exercise["category"]) => {
    switch (category) {
      case "cardio":
        return <Zap className="h-4 w-4" />
      case "strength":
        return <Dumbbell className="h-4 w-4" />
      case "flexibility":
        return <Target className="h-4 w-4" />
      case "sports":
        return <Play className="h-4 w-4" />
      default:
        return <Dumbbell className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Exercise["category"]) => {
    switch (category) {
      case "cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "sports":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: Exercise["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDifficultyLabel = (difficulty: Exercise["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "Fillestar"
      case "intermediate":
        return "Mesatar"
      case "advanced":
        return "I Avancuar"
      default:
        return difficulty
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Duke ngarkuar stërvitjet...</p>
        </div>
      </div>
    )
  }

  if (!profile || !workoutPlan) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kthehu
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Dumbbell className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Stërvitje</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Nuk ka të dhëna profili</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Për të marrë rekomandime stërvitjeje, ju duhet të vendosni qëllimet tuaja më parë.
          </p>
          <Button asChild>
            <Link href="/goals">Vendosni Qëllimet</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/recommendations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ushqimi
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Stërvitje</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Workout Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plani Juaj i Stërvitjes</CardTitle>
            <CardDescription>
              Bazuar në qëllimin tuaj:{" "}
              {profile.goal === "weight-loss"
                ? "Humbje Peshe"
                : profile.goal === "weight-gain"
                  ? "Fitim Peshe"
                  : profile.goal === "muscle-gain"
                    ? "Fitim Muskujsh"
                    : "Mirëmbajtje"}{" "}
              dhe nivelin e aktivitetit:{" "}
              {profile.activityLevel === "sedentary"
                ? "Sedentare"
                : profile.activityLevel === "light"
                  ? "I Lehtë"
                  : profile.activityLevel === "moderate"
                    ? "Mesatar"
                    : profile.activityLevel === "active"
                      ? "Aktiv"
                      : "Shumë Aktiv"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{workoutPlan.sessionsPerWeek}</div>
                <div className="text-sm text-muted-foreground">Seanca/Javë</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-1">{workoutPlan.sessionDuration}</div>
                <div className="text-sm text-muted-foreground">Minuta/Seancë</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-2">{workoutPlan.totalExercises}</div>
                <div className="text-sm text-muted-foreground">Stërvitje</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-3">
                  {Math.round((completedExercises.size / workoutPlan.totalExercises) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Përfunduar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plan">Plani i Stërvitjes</TabsTrigger>
            <TabsTrigger value="exercises">Të Gjitha Stërvitjet</TabsTrigger>
          </TabsList>

          {/* Workout Plan */}
          <TabsContent value="plan" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlan.workouts.map((workout, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      {workout.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {Math.round(workout.estimatedCalories)} kal
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleExerciseComplete(`${index}-${exerciseIndex}`)}
                            >
                              <CheckCircle
                                className={`h-4 w-4 ${
                                  completedExercises.has(`${index}-${exerciseIndex}`)
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            <div>
                              <p className="font-medium text-sm">{exercise.exercise.nameAlbanian}</p>
                              <p className="text-xs text-muted-foreground">
                                {exercise.duration} min • {Math.round(exercise.estimatedCalories)} kal
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className={getCategoryColor(exercise.exercise.category)} size="sm">
                            {getCategoryIcon(exercise.exercise.category)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getDifficultyColor(exercise.exercise.difficulty)}
                            size="sm"
                          >
                            {getDifficultyLabel(exercise.exercise.difficulty)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t text-xs text-muted-foreground">Fokusi: {workout.focus}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exercise Database */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {exerciseDatabase.map((exercise) => (
                <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{exercise.nameAlbanian}</CardTitle>
                      <Badge variant="outline" className={getCategoryColor(exercise.category)}>
                        {getCategoryIcon(exercise.category)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{exercise.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">{exercise.caloriesPerMinute}</div>
                      <div className="text-xs text-muted-foreground">kal/min</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                        {getDifficultyLabel(exercise.difficulty)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Rekomanduar: 20-45 min
                      </div>
                    </div>

                    {exercise.equipment.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Pajisje:</strong> {exercise.equipment.join(", ")}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <strong>Për 30 min:</strong> ~{Math.round(exercise.caloriesPerMinute * 30)} kalori
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/progress">Shiko Progresin</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
