"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, Target, Calendar, Plus, Minus } from "lucide-react"
import Link from "next/link"
import type { UserProfile, CalorieResult } from "@/lib/health-utils"
import { calculateNutrition } from "@/lib/health-utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ProgressEntry {
  date: string
  weight: number
  calories: number
  workouts: number
}

interface WeeklyStats {
  week: string
  avgWeight: number
  totalCalories: number
  totalWorkouts: number
}

export default function ProgressPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [results, setResults] = useState<CalorieResult | null>(null)
  const [progressData, setProgressData] = useState<ProgressEntry[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [currentWeight, setCurrentWeight] = useState("")
  const [todayCalories, setTodayCalories] = useState("")
  const [todayWorkouts, setTodayWorkouts] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as UserProfile
      setProfile(parsedProfile)

      const nutritionResults = calculateNutrition(parsedProfile)
      setResults(nutritionResults)

      // Load progress data from localStorage
      const savedProgress = localStorage.getItem("progressData")
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress) as ProgressEntry[]
        setProgressData(parsedProgress)
        generateWeeklyStats(parsedProgress)
      } else {
        // Generate sample data for demonstration
        generateSampleData(parsedProfile)
      }
    }
    setLoading(false)
  }, [])

  const generateSampleData = (userProfile: UserProfile) => {
    const sampleData: ProgressEntry[] = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) // Last 30 days

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      // Simulate weight changes based on goal
      let weightChange = 0
      if (userProfile.goal === "weight-loss") {
        weightChange = -0.1 + Math.random() * 0.05 // Gradual weight loss
      } else if (userProfile.goal === "weight-gain") {
        weightChange = 0.05 + Math.random() * 0.05 // Gradual weight gain
      } else {
        weightChange = (Math.random() - 0.5) * 0.1 // Small fluctuations
      }

      const weight = userProfile.weight + weightChange * i
      const calories = 1800 + Math.random() * 600 // Random calorie intake
      const workouts = Math.random() > 0.7 ? 1 : 0 // 30% chance of workout

      sampleData.push({
        date: date.toISOString().split("T")[0],
        weight: Math.round(weight * 10) / 10,
        calories: Math.round(calories),
        workouts,
      })
    }

    setProgressData(sampleData)
    generateWeeklyStats(sampleData)
    localStorage.setItem("progressData", JSON.stringify(sampleData))
  }

  const generateWeeklyStats = (data: ProgressEntry[]) => {
    const weeks: { [key: string]: ProgressEntry[] } = {}

    data.forEach((entry) => {
      const date = new Date(entry.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeks[weekKey]) {
        weeks[weekKey] = []
      }
      weeks[weekKey].push(entry)
    })

    const weeklyData: WeeklyStats[] = Object.entries(weeks).map(([week, entries]) => ({
      week: new Date(week).toLocaleDateString("sq-AL", { month: "short", day: "numeric" }),
      avgWeight: Math.round((entries.reduce((sum, entry) => sum + entry.weight, 0) / entries.length) * 10) / 10,
      totalCalories: entries.reduce((sum, entry) => sum + entry.calories, 0),
      totalWorkouts: entries.reduce((sum, entry) => sum + entry.workouts, 0),
    }))

    setWeeklyStats(weeklyData.slice(-8)) // Last 8 weeks
  }

  const addTodayEntry = () => {
    if (!currentWeight || !todayCalories || !profile) return

    const today = new Date().toISOString().split("T")[0]
    const newEntry: ProgressEntry = {
      date: today,
      weight: Number.parseFloat(currentWeight),
      calories: Number.parseInt(todayCalories),
      workouts: Number.parseInt(todayWorkouts) || 0,
    }

    // Remove existing entry for today if it exists
    const updatedData = progressData.filter((entry) => entry.date !== today)
    updatedData.push(newEntry)
    updatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setProgressData(updatedData)
    generateWeeklyStats(updatedData)
    localStorage.setItem("progressData", JSON.stringify(updatedData))

    // Clear form
    setCurrentWeight("")
    setTodayCalories("")
    setTodayWorkouts("")
  }

  const getGoalProgress = () => {
    if (!profile || progressData.length < 2) return 0

    const firstEntry = progressData[0]
    const lastEntry = progressData[progressData.length - 1]
    const weightChange = lastEntry.weight - firstEntry.weight

    if (profile.goal === "weight-loss") {
      // Target: lose 0.5kg per week, so about 2kg per month
      const targetLoss = -2
      return Math.min(100, Math.max(0, (Math.abs(weightChange) / Math.abs(targetLoss)) * 100))
    } else if (profile.goal === "weight-gain") {
      // Target: gain 0.5kg per week, so about 2kg per month
      const targetGain = 2
      return Math.min(100, Math.max(0, (weightChange / targetGain) * 100))
    } else {
      // Maintenance: stay within 1kg of starting weight
      return Math.min(100, Math.max(0, 100 - (Math.abs(weightChange) / 1) * 100))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Duke ngarkuar progresin...</p>
        </div>
      </div>
    )
  }

  if (!profile || !results) {
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
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Progresi</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Nuk ka të dhëna profili</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Për të ndjekur progresin tuaj, ju duhet të vendosni qëllimet tuaja më parë.
          </p>
          <Button asChild>
            <Link href="/goals">Vendosni Qëllimet</Link>
          </Button>
        </div>
      </div>
    )
  }

  const goalProgress = getGoalProgress()
  const latestWeight = progressData.length > 0 ? progressData[progressData.length - 1].weight : profile.weight
  const weightChange = progressData.length > 1 ? latestWeight - progressData[0].weight : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/exercises">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Stërvitje
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Progresi Juaj</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pesha Aktuale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{latestWeight} kg</div>
              <div className="flex items-center gap-1 text-sm">
                {weightChange > 0 ? (
                  <Plus className="h-3 w-3 text-green-600" />
                ) : weightChange < 0 ? (
                  <Minus className="h-3 w-3 text-red-600" />
                ) : null}
                <span className={weightChange > 0 ? "text-green-600" : weightChange < 0 ? "text-red-600" : ""}>
                  {Math.abs(weightChange).toFixed(1)} kg
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Qëllimi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(goalProgress)}%</div>
              <Progress value={goalProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Kalori Mesatare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {progressData.length > 0
                  ? Math.round(progressData.reduce((sum, entry) => sum + entry.calories, 0) / progressData.length)
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">kal/ditë</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Stërvitje Javore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {weeklyStats.length > 0 ? weeklyStats[weeklyStats.length - 1]?.totalWorkouts || 0 : 0}
              </div>
              <div className="text-sm text-muted-foreground">java e fundit</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ndryshimi i Peshës</CardTitle>
                <CardDescription>Progresi juaj gjatë 30 ditëve të fundit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("sq-AL", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString("sq-AL")}
                      formatter={(value: number) => [`${value} kg`, "Pesha"]}
                    />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Stats Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Statistikat Javore</CardTitle>
                <CardDescription>Stërvitje dhe kalori për javë</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="totalWorkouts" fill="hsl(var(--primary))" name="Stërvitje" />
                    <Bar yAxisId="right" dataKey="totalCalories" fill="hsl(var(--chart-2))" name="Kalori" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Add Today's Data */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Shto të Dhënat e Sotme
                </CardTitle>
                <CardDescription>Regjistroni progresin tuaj ditor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Pesha (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Kalori të Konsumuara</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="2000"
                    value={todayCalories}
                    onChange={(e) => setTodayCalories(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workouts">Stërvitje (numri)</Label>
                  <Input
                    id="workouts"
                    type="number"
                    placeholder="1"
                    value={todayWorkouts}
                    onChange={(e) => setTodayWorkouts(e.target.value)}
                  />
                </div>

                <Button onClick={addTodayEntry} className="w-full" disabled={!currentWeight || !todayCalories}>
                  Shto të Dhënat
                </Button>
              </CardContent>
            </Card>

            {/* Goal Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Statusi i Qëllimit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresi</span>
                    <span>{Math.round(goalProgress)}%</span>
                  </div>
                  <Progress value={goalProgress} />
                </div>

                <div className="space-y-2">
                  <Badge
                    variant={goalProgress >= 75 ? "default" : goalProgress >= 50 ? "secondary" : "outline"}
                    className="w-full justify-center"
                  >
                    {goalProgress >= 75
                      ? "Në rrugë të mirë!"
                      : goalProgress >= 50
                        ? "Progres i mirë"
                        : "Vazhdoni përpjekjet"}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Qëllimi:</strong>{" "}
                    {profile.goal === "weight-loss"
                      ? "Humbje Peshe"
                      : profile.goal === "weight-gain"
                        ? "Fitim Peshe"
                        : profile.goal === "muscle-gain"
                          ? "Fitim Muskujsh"
                          : "Mirëmbajtje"}
                  </p>
                  <p>
                    <strong>Pesha fillestare:</strong> {profile.weight} kg
                  </p>
                  <p>
                    <strong>Ndryshimi:</strong> {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} kg
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
