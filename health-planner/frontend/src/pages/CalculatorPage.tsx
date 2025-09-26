"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { calculateBMR, calculateTDEE, calculateBMI } from "@/lib/health-utils"

export default function CalculatorPage() {
  const [results, setResults] = useState<{
    bmr: number
    tdee: number
    bmi: number
    bmiCategory: string
    dailyCalories: {
      lose: number
      maintain: number
      gain: number
    }
  } | null>(null)

  useEffect(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem("healthData")
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.age && data.weight && data.height && data.gender && data.activityLevel) {
        const bmr = calculateBMR(
          Number.parseInt(data.weight),
          Number.parseInt(data.height),
          Number.parseInt(data.age),
          data.gender,
        )
        const tdee = calculateTDEE(bmr, data.activityLevel)
        const bmi = calculateBMI(Number.parseInt(data.weight), Number.parseInt(data.height))

        let bmiCategory = "Normal"
        if (bmi < 18.5) bmiCategory = "Nënpeshë"
        else if (bmi >= 25 && bmi < 30) bmiCategory = "Mbipeshë"
        else if (bmi >= 30) bmiCategory = "Obez"

        setResults({
          bmr,
          tdee,
          bmi,
          bmiCategory,
          dailyCalories: {
            lose: Math.round(tdee - 500),
            maintain: Math.round(tdee),
            gain: Math.round(tdee + 500),
          },
        })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kthehu
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Kalkulatori i Kalorive</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {results ? (
          <div className="grid gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Rezultatet Tuaja</CardTitle>
                <CardDescription>Bazuar në informacionet që keni dhënë</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{results.bmr}</div>
                    <div className="text-sm text-muted-foreground">BMR (Kalori bazë)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{results.tdee}</div>
                    <div className="text-sm text-muted-foreground">TDEE (Kalori totale)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{results.bmi.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">BMI</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">{results.bmiCategory}</div>
                    <div className="text-sm text-muted-foreground">Kategoria BMI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rekomandime Kalorike Ditore</CardTitle>
                <CardDescription>Bazuar në qëllimet tuaja të fitnesit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">{results.dailyCalories.lose}</div>
                    <div className="font-semibold mb-1">Humbje Peshe</div>
                    <div className="text-sm text-muted-foreground">-500 kalori nga TDEE</div>
                  </div>
                  <div className="text-center p-6 border rounded-lg bg-primary/5">
                    <div className="text-3xl font-bold text-primary mb-2">{results.dailyCalories.maintain}</div>
                    <div className="font-semibold mb-1">Mirëmbajtje</div>
                    <div className="text-sm text-muted-foreground">TDEE normale</div>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{results.dailyCalories.gain}</div>
                    <div className="font-semibold mb-1">Fitim Peshe</div>
                    <div className="text-sm text-muted-foreground">+500 kalori nga TDEE</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button size="lg" asChild>
                <Link to="/recommendations">Shiko Rekomandimet</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Nuk ka të dhëna</CardTitle>
              <CardDescription>Ju lutem plotësoni qëllimet tuaja për të parë kalkulimet</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link to="/goals">Vendos Qëllimet</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
