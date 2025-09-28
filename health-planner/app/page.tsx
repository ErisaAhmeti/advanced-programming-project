import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Target, Calculator, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-balance">Planner Shëndeti</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/goals" className="text-muted-foreground hover:text-foreground transition-colors">
                Qëllimet
              </Link>
              <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                Kalkulatori
              </Link>
              <Link href="/recommendations" className="text-muted-foreground hover:text-foreground transition-colors">
                Rekomandimet
              </Link>
              <Link href="/progress" className="text-muted-foreground hover:text-foreground transition-colors">
                Progresi
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Planifikoni Shëndetin Tuaj</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Merrni rekomandime të personalizuara për ushqim dhe stërvitje bazuar në qëllimet tuaja të fitnesit.
            Llogaritni kaloritë dhe përbërësit për një jetë më të shëndetshme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/goals">Filloni Tani</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/calculator">Kalkulatori i Kalorive</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-balance">Veçoritë Kryesore</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Qëllime të Personalizuara</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Vendosni qëllimet tuaja të fitnesit dhe merrni plane të personalizuara për humbje peshe, fitim
                  muskujsh ose mirëmbajtje.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Kalkulatori i Kalorive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Llogaritni nevojat tuaja ditore për kalori dhe përbërës bazuar në moshën, peshën dhe nivelin e
                  aktivitetit.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Rekomandime Ushqimi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Merrni sugjerime të personalizuara për ushqime dhe vakte që përputhen me qëllimet tuaja shëndetësore.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Ndjekja e Progresit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-pretty">
                  Monitoroni progresin tuaj me grafikë dhe statistika të detajuara për të qëndruar të motivuar.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Gati për të Filluar Udhëtimin Tuaj të Shëndetit?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-pretty">
                Bashkohuni me mijëra përdorues që kanë arritur qëllimet e tyre të shëndetit me planerin tonë të
                personalizuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/goals">Krijoni Planin Tuaj</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Planner Shëndeti. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  )
}
