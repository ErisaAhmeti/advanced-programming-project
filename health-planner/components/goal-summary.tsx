import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserProfile } from "@/lib/health-utils"
import { User, Activity, Target } from "lucide-react"

interface GoalSummaryProps {
  profile: UserProfile
}

export function GoalSummary({ profile }: GoalSummaryProps) {
  const getGoalLabel = (goal: UserProfile["goal"]) => {
    switch (goal) {
      case "weight-loss":
        return "Humbje Peshe"
      case "weight-gain":
        return "Fitim Peshe"
      case "muscle-gain":
        return "Fitim Muskujsh"
      case "maintenance":
        return "Mirëmbajtje"
      default:
        return goal
    }
  }

  const getActivityLabel = (level: UserProfile["activityLevel"]) => {
    switch (level) {
      case "sedentary":
        return "Sedentare"
      case "light":
        return "Aktivitet i Lehtë"
      case "moderate":
        return "Aktivitet Mesatar"
      case "active":
        return "Shumë Aktiv"
      case "very-active":
        return "Jashtëzakonisht Aktiv"
      default:
        return level
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Përmbledhja e Profilit
        </CardTitle>
        <CardDescription>Informacionet tuaja personale dhe qëllimet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Mosha</p>
            <p className="font-medium">{profile.age} vjeç</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Gjinia</p>
            <p className="font-medium">{profile.gender === "male" ? "Mashkull" : "Femër"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pesha</p>
            <p className="font-medium">{profile.weight} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Gjatësia</p>
            <p className="font-medium">{profile.height} cm</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Niveli i Aktivitetit</span>
          </div>
          <Badge variant="secondary">{getActivityLabel(profile.activityLevel)}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Qëllimi</span>
          </div>
          <Badge className="bg-primary text-primary-foreground">{getGoalLabel(profile.goal)}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
