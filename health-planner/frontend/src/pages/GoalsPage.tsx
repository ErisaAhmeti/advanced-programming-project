"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Target, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function GoalsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    goal: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store data in localStorage for other components to use
    localStorage.setItem("healthData", JSON.stringify(formData))
    // Navigate to calculator
    navigate("/calculator")
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
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kthehu
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Qëllimet Tuaja</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-primary/20 shadow-xl shadow-primary/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Vendosni Qëllimet Tuaja të Shëndetit
            </CardTitle>
            <CardDescription className="text-center text-base">
              Plotësoni informacionet tuaja për të marrë rekomandime të personalizuara
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Mosha</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Pesha (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Lartësia (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Gjinia</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Mashkull</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Femër</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Niveli i Aktivitetit</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                >
                  <SelectTrigger className="border-primary/30 focus:ring-2 focus:ring-primary/30">
                    <SelectValue placeholder="Zgjidhni nivelin e aktivitetit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (pa aktivitet fizik)</SelectItem>
                    <SelectItem value="light">I lehtë (1-3 ditë në javë)</SelectItem>
                    <SelectItem value="moderate">Mesatar (3-5 ditë në javë)</SelectItem>
                    <SelectItem value="active">Aktiv (6-7 ditë në javë)</SelectItem>
                    <SelectItem value="very-active">Shumë aktiv (2x në ditë)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Qëllimi Juaj</Label>
                <RadioGroup value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="lose" id="lose" />
                    <Label htmlFor="lose">Humbje peshe</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain">Mirëmbajtje peshe</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="gain" id="gain" />
                    <Label htmlFor="gain">Fitim peshe/muskujsh</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-primary" size="lg">
                Ruaj Qëllimet
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
