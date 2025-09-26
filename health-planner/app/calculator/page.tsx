"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calculator, Flame, Target, Zap } from "lucide-react"
import Link from "next/link"
import type { UserProfile, CalorieResult } from "@/lib/health-utils"
import { calculateNutrition } from "@/lib/health-utils"
import { GoalSummary } from "@/components/goal-summary"
import { Progress } from "@/components/ui/progress"

export default function CalculatorPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [results, setResults] = useState<CalorieResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as UserProfile
      setProfile(parsedProfile)

      // Calculate nutrition immediately
      const nutritionResults = calculateNutrition(parsedProfile)
      setResults(nutritionResults)
    }
    setLoading(false)
  }, [])

  const recalculate = () => {
    if (profile) {
      const nutritionResults = calculateNutrition(profile)
      setResults(nutritionResults)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Duke ngarkuar...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
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
                <Calculator className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Kalkulatori i Kalorive</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Nuk ka të dhëna profili</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Për të përdorur kalkulatorin e kalorive, ju duhet të vendosni qëllimet tuaja të shëndetit më parë.
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
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kthehu
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Kalkulatori i Kalorive</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <GoalSummary profile={profile} />
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/goals">Ndrysho Profilin</Link>
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                {/* Main Calorie Results */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardHeader className="pb-3">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <CardTitle className="text-lg">BMR</CardTitle>
                      <CardDescription>Metabolizmi Bazal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{Math.round(results.bmr)}</div>
                      <p className="text-sm text-muted-foreground">kalori/ditë</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardHeader className="pb-3">
                      <Flame className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <CardTitle className="text-lg">TDEE</CardTitle>
                      <CardDescription>Shpenzimi Total</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">{Math.round(results.tdee)}</div>
                      <p className="text-sm text-muted-foreground">kalori/ditë</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-primary">
                    <CardHeader className="pb-3">
                      <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                      <CardTitle className="text-lg">Objektivi</CardTitle>
                      <CardDescription>Kalori të Rekomanduara</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{Math.round(results.targetCalories)}</div>
                      <p className="text-sm text-muted-foreground">kalori/ditë</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Macronutrient Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shpërndarja e Makronutrientëve</CardTitle>
                    <CardDescription>
                      Rekomandimi i përditshëm i proteinave, karbohidrateve dhe yndyrave
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Protein */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-chart-1">Proteina</span>
                        <span className="text-sm text-muted-foreground">{results.protein}g</span>
                      </div>
                      <Progress
                        value={((results.protein * 4) / results.targetCalories) * 100}
                        className="h-3"
                        style={{
                          background: "var(--muted)",
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(((results.protein * 4) / results.targetCalories) * 100)}% e kalorive</span>
                        <span>{results.protein * 4} kalori</span>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-chart-2">Karbohidrate</span>
                        <span className="text-sm text-muted-foreground">{results.carbs}g</span>
                      </div>
                      <Progress value={((results.carbs * 4) / results.targetCalories) * 100} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(((results.carbs * 4) / results.targetCalories) * 100)}% e kalorive</span>
                        <span>{results.carbs * 4} kalori</span>
                      </div>
                    </div>

                    {/* Fat */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-chart-3">Yndyra</span>
                        <span className="text-sm text-muted-foreground">{results.fat}g</span>
                      </div>
                      <Progress value={((results.fat * 9) / results.targetCalories) * 100} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.round(((results.fat * 9) / results.targetCalories) * 100)}% e kalorive</span>
                        <span>{results.fat * 9} kalori</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Explanation Card */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Shpjegimi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <strong>BMR (Metabolizmi Bazal):</strong> Kaloritë që trupi juaj djeg në pushim për të mbajtur
                      funksionet bazë si frymëmarrja dhe qarkullimi i gjakut.
                    </div>
                    <div>
                      <strong>TDEE (Shpenzimi Total Ditor):</strong> BMR + kaloritë e djegura nga aktiviteti fizik dhe
                      lëvizja ditore.
                    </div>
                    <div>
                      <strong>Kaloritë e Rekomanduara:</strong> Kaloritë që duhet të konsumoni për të arritur qëllimin
                      tuaj (humbje/fitim peshe ose mirëmbajtje).
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={recalculate} variant="outline" className="flex-1 bg-transparent">
                    Rillogarit
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/recommendations">Shiko Rekomandimet</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
