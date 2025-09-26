"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Target, User, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { UserProfile } from "@/lib/health-utils"
import { useRouter } from "next/navigation"

export default function GoalsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 25,
    weight: 70,
    height: 170,
    gender: "male",
    activityLevel: "moderate",
    goal: "maintenance",
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save profile and redirect to calculator
      localStorage.setItem("healthProfile", JSON.stringify(profile))
      router.push("/calculator")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return profile.age && profile.gender
      case 2:
        return profile.weight && profile.height
      case 3:
        return profile.activityLevel
      case 4:
        return profile.goal
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent)]">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
      </div>
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
              <Target className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Vendosni Qëllimet Tuaja</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Hapi {step} nga 4</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card className="border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <User className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Informacione Bazë
                </CardTitle>
                <CardDescription>Na tregoni pak për veten tuaj</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Mosha</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age || ""}
                    onChange={(e) => setProfile({ ...profile, age: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Gjinia</Label>
                  <RadioGroup
                    value={profile.gender}
                    onValueChange={(value) => setProfile({ ...profile, gender: value as "male" | "female" })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Mashkull</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Femër</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Physical Stats */}
          {step === 2 && (
            <Card className="border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Statistikat Fizike
                </CardTitle>
                <CardDescription>Pesha dhe gjatësia juaj aktuale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Pesha: {profile.weight} kg</Label>
                  <Slider
                    value={[profile.weight || 70]}
                    onValueChange={(value) => setProfile({ ...profile, weight: value[0] })}
                    max={200}
                    min={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>30 kg</span>
                    <span>200 kg</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gjatësia: {profile.height} cm</Label>
                  <Slider
                    value={[profile.height || 170]}
                    onValueChange={(value) => setProfile({ ...profile, height: value[0] })}
                    max={220}
                    min={120}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>120 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Activity Level */}
          {step === 3 && (
            <Card className="border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Niveli i Aktivitetit
                </CardTitle>
                <CardDescription>Sa aktiv jeni gjatë javës?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={profile.activityLevel}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      activityLevel: value as UserProfile["activityLevel"],
                    })
                  }
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="sedentary" id="sedentary" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="sedentary" className="font-medium">
                        Sedentare (Pa aktivitet)
                      </Label>
                      <p className="text-sm text-muted-foreground">Punë zyre, pa stërvitje të rregullt</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="light" id="light" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="light" className="font-medium">
                        Aktivitet i Lehtë
                      </Label>
                      <p className="text-sm text-muted-foreground">Stërvitje e lehtë 1-3 ditë në javë</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="moderate" className="font-medium">
                        Aktivitet Mesatar
                      </Label>
                      <p className="text-sm text-muted-foreground">Stërvitje mesatare 3-5 ditë në javë</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="active" id="active" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="active" className="font-medium">
                        Shumë Aktiv
                      </Label>
                      <p className="text-sm text-muted-foreground">Stërvitje intensive 6-7 ditë në javë</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="very-active" id="very-active" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="very-active" className="font-medium">
                        Jashtëzakonisht Aktiv
                      </Label>
                      <p className="text-sm text-muted-foreground">Stërvitje intensive + punë fizike</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <Card className="border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Qëllimi Juaj
                </CardTitle>
                <CardDescription>Çfarë doni të arrini?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={profile.goal}
                  onValueChange={(value) =>
                    setProfile({
                      ...profile,
                      goal: value as UserProfile["goal"],
                    })
                  }
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="weight-loss" id="weight-loss" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="weight-loss" className="font-medium">
                        Humbje Peshe
                      </Label>
                      <p className="text-sm text-muted-foreground">Dua të humbas peshë në mënyrë të shëndetshme</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="weight-gain" id="weight-gain" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="weight-gain" className="font-medium">
                        Fitim Peshe
                      </Label>
                      <p className="text-sm text-muted-foreground">Dua të shtoj peshë dhe masë trupore</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="muscle-gain" id="muscle-gain" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="muscle-gain" className="font-medium">
                        Fitim Muskujsh
                      </Label>
                      <p className="text-sm text-muted-foreground">Dua të ndërtoj muskuj dhe forcë</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="maintenance" id="maintenance" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="maintenance" className="font-medium">
                        Mirëmbajtje
                      </Label>
                      <p className="text-sm text-muted-foreground">Dua të ruaj peshën dhe formën aktuale</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={handleBack} disabled={step === 1}>
              Mbrapa
            </Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20" onClick={handleNext} disabled={!isStepComplete()}>
              {step === 4 ? "Përfundo" : "Vazhdo"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
