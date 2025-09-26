"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { getMealRecommendations } from "@/lib/meal-planner"

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any>(null)
  const [userGoal, setUserGoal] = useState<string>("")

  useEffect(() => {
    const savedData = localStorage.getItem("healthData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setUserGoal(data.goal || "maintain")
      const recs = getMealRecommendations(data.goal || "maintain")
      setRecommendations(recs)
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
              <Utensils className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Rekomandimet e Ushqimit</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {recommendations ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Plani Juaj i Ushqimit</CardTitle>
                <CardDescription>
                  Rekomandime të personalizuara për qëllimin:{" "}
                  {userGoal === "lose" ? "Humbje peshe" : userGoal === "gain" ? "Fitim peshe" : "Mirëmbajtje peshe"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {recommendations.meals.map((meal: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Ushqime të Rekomanduara:</h4>
                          <div className="flex flex-wrap gap-2">
                            {meal.foods.map((food: string, i: number) => (
                              <Badge key={i} variant="secondary">
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Informacione Ushqyese:</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Kalori: ~{meal.calories}</div>
                            <div>Proteina: ~{meal.protein}g</div>
                            <div>Karbohidrate: ~{meal.carbs}g</div>
                            <div>Yndyrna: ~{meal.fats}g</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Këshilla të Përgjithshme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button size="lg" asChild>
                <Link to="/exercises">Shiko Stërvitjet</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Nuk ka të dhëna</CardTitle>
              <CardDescription>Ju lutem plotësoni qëllimet tuaja për të parë rekomandimet</CardDescription>
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
