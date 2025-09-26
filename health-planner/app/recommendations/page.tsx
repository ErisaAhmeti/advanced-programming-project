"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Utensils, Apple, Beef, Wheat, Droplets } from "lucide-react"
import Link from "next/link"
import type { UserProfile, CalorieResult, Food } from "@/lib/health-utils"
import { calculateNutrition, foodDatabase } from "@/lib/health-utils"
import { generateMealPlan, type MealPlan } from "@/lib/meal-planner"

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [results, setResults] = useState<CalorieResult | null>(null)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as UserProfile
      setProfile(parsedProfile)

      const nutritionResults = calculateNutrition(parsedProfile)
      setResults(nutritionResults)

      const generatedMealPlan = generateMealPlan(nutritionResults, parsedProfile.goal)
      setMealPlan(generatedMealPlan)
    }
    setLoading(false)
  }, [])

  const getCategoryIcon = (category: Food["category"]) => {
    switch (category) {
      case "protein":
        return <Beef className="h-4 w-4" />
      case "carbs":
        return <Wheat className="h-4 w-4" />
      case "fat":
        return <Droplets className="h-4 w-4" />
      case "vegetable":
      case "fruit":
        return <Apple className="h-4 w-4" />
      case "dairy":
        return <Utensils className="h-4 w-4" />
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Food["category"]) => {
    switch (category) {
      case "protein":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "carbs":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "fat":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "vegetable":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "fruit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "dairy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Utensils className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Duke ngarkuar rekomandimet...</p>
        </div>
      </div>
    )
  }

  if (!profile || !results || !mealPlan) {
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
                <Utensils className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Rekomandime Ushqimi</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Nuk ka të dhëna profili</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Për të marrë rekomandime ushqimi, ju duhet të vendosni qëllimet tuaja dhe të llogaritni kaloritë më parë.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/goals">Vendosni Qëllimet</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/calculator">Kalkulatori</Link>
            </Button>
          </div>
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
              <Link href="/calculator">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kalkulatori
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Rekomandime Ushqimi</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Daily Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Plani Juaj Ditor</CardTitle>
            <CardDescription>
              Bazuar në qëllimin tuaj:{" "}
              {profile.goal === "weight-loss"
                ? "Humbje Peshe"
                : profile.goal === "weight-gain"
                  ? "Fitim Peshe"
                  : profile.goal === "muscle-gain"
                    ? "Fitim Muskujsh"
                    : "Mirëmbajtje"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{Math.round(results.targetCalories)}</div>
                <div className="text-sm text-muted-foreground">Kalori</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-1">{results.protein}g</div>
                <div className="text-sm text-muted-foreground">Proteina</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-2">{results.carbs}g</div>
                <div className="text-sm text-muted-foreground">Karbohidrate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-3">{results.fat}g</div>
                <div className="text-sm text-muted-foreground">Yndyra</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="meals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meals">Plani i Vakteve</TabsTrigger>
            <TabsTrigger value="foods">Ushqime të Rekomanduara</TabsTrigger>
          </TabsList>

          {/* Meal Plan */}
          <TabsContent value="meals" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Breakfast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    Mëngjesi
                  </CardTitle>
                  <CardDescription>{Math.round(mealPlan.breakfast.totalCalories)} kalori</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mealPlan.breakfast.foods.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.food.nameAlbanian}</p>
                        <p className="text-sm text-muted-foreground">{item.amount}g</p>
                      </div>
                      <Badge variant="outline" className={getCategoryColor(item.food.category)}>
                        {getCategoryIcon(item.food.category)}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    P: {Math.round(mealPlan.breakfast.totalProtein)}g | K: {Math.round(mealPlan.breakfast.totalCarbs)}g
                    | Y: {Math.round(mealPlan.breakfast.totalFat)}g
                  </div>
                </CardContent>
              </Card>

              {/* Lunch */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    Dreka
                  </CardTitle>
                  <CardDescription>{Math.round(mealPlan.lunch.totalCalories)} kalori</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mealPlan.lunch.foods.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.food.nameAlbanian}</p>
                        <p className="text-sm text-muted-foreground">{item.amount}g</p>
                      </div>
                      <Badge variant="outline" className={getCategoryColor(item.food.category)}>
                        {getCategoryIcon(item.food.category)}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    P: {Math.round(mealPlan.lunch.totalProtein)}g | K: {Math.round(mealPlan.lunch.totalCarbs)}g | Y:{" "}
                    {Math.round(mealPlan.lunch.totalFat)}g
                  </div>
                </CardContent>
              </Card>

              {/* Dinner */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    Darka
                  </CardTitle>
                  <CardDescription>{Math.round(mealPlan.dinner.totalCalories)} kalori</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mealPlan.dinner.foods.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.food.nameAlbanian}</p>
                        <p className="text-sm text-muted-foreground">{item.amount}g</p>
                      </div>
                      <Badge variant="outline" className={getCategoryColor(item.food.category)}>
                        {getCategoryIcon(item.food.category)}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    P: {Math.round(mealPlan.dinner.totalProtein)}g | K: {Math.round(mealPlan.dinner.totalCarbs)}g | Y:{" "}
                    {Math.round(mealPlan.dinner.totalFat)}g
                  </div>
                </CardContent>
              </Card>

              {/* Snacks */}
              {mealPlan.snacks && mealPlan.snacks.foods.length > 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      Ushqime të Vogla
                    </CardTitle>
                    <CardDescription>{Math.round(mealPlan.snacks.totalCalories)} kalori</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mealPlan.snacks.foods.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.food.nameAlbanian}</p>
                            <p className="text-sm text-muted-foreground">{item.amount}g</p>
                          </div>
                          <Badge variant="outline" className={getCategoryColor(item.food.category)}>
                            {getCategoryIcon(item.food.category)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
                      P: {Math.round(mealPlan.snacks.totalProtein)}g | K: {Math.round(mealPlan.snacks.totalCarbs)}g | Y:{" "}
                      {Math.round(mealPlan.snacks.totalFat)}g
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Food Database */}
          <TabsContent value="foods" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {foodDatabase.map((food) => (
                <Card key={food.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{food.nameAlbanian}</CardTitle>
                      <Badge variant="outline" className={getCategoryColor(food.category)}>
                        {getCategoryIcon(food.category)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{food.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-lg font-bold text-primary">{food.calories} kal</div>
                    <div className="text-xs text-muted-foreground">për 100g</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-chart-1">{food.protein}g</div>
                        <div className="text-muted-foreground">Proteina</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-chart-2">{food.carbs}g</div>
                        <div className="text-muted-foreground">Karbo</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-chart-3">{food.fat}g</div>
                        <div className="text-muted-foreground">Yndyra</div>
                      </div>
                    </div>
                    {food.fiber && <div className="text-xs text-muted-foreground">Fibra: {food.fiber}g</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/exercises">Shiko Stërvitjet</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
