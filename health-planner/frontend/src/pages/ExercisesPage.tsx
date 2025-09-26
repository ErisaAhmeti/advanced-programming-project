import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, ArrowLeft, Clock, Target } from "lucide-react"
import { Link } from "react-router-dom"

const exercises = [
  {
    name: "Cardio për Humbje Peshe",
    duration: "30-45 min",
    difficulty: "Mesatar",
    exercises: ["Vrapim", "Biçikletë", "Notim", "Kërcim me litar", "Aerobik"],
    description: "Stërvitje kardiovaskulare për djegien e kalorive dhe humbjen e peshës.",
  },
  {
    name: "Forcë për Fitim Muskujsh",
    duration: "45-60 min",
    difficulty: "I vështirë",
    exercises: ["Squat", "Deadlift", "Bench Press", "Pull-ups", "Overhead Press"],
    description: "Stërvitje me pesha për ndërtimin e masës muskulore.",
  },
  {
    name: "Yoga për Fleksibilitet",
    duration: "30-45 min",
    difficulty: "I lehtë",
    exercises: ["Sun Salutation", "Warrior Pose", "Downward Dog", "Tree Pose", "Meditation"],
    description: "Stërvitje yoga për fleksibilitet dhe relaksim.",
  },
  {
    name: "HIIT për Kondicion",
    duration: "20-30 min",
    difficulty: "I vështirë",
    exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees", "Plank"],
    description: "Stërvitje me intensitet të lartë për përmirësimin e kondicionit fizik.",
  },
]

export default function ExercisesPage() {
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
              <Dumbbell className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Stërvitjet</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Plane Stërvitjeje</h2>
            <p className="text-muted-foreground">
              Zgjidhni planin e stërvitjes që përputhet me qëllimet tuaja të fitnesit
            </p>
          </div>

          <div className="grid gap-6">
            {exercises.map((workout, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{workout.name}</CardTitle>
                      <CardDescription className="mt-2">{workout.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        workout.difficulty === "I lehtë"
                          ? "secondary"
                          : workout.difficulty === "Mesatar"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {workout.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {workout.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {workout.exercises.length} stërvitje
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Stërvitjet:</h4>
                      <div className="flex flex-wrap gap-2">
                        {workout.exercises.map((exercise, i) => (
                          <Badge key={i} variant="outline">
                            {exercise}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/progress">Ndjek Progresin</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
