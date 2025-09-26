import type React from "react"
import { Activity } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-balance">Planner Shëndeti</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/goals"
                className={`transition-colors ${
                  isActive("/goals") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Qëllimet
              </Link>
              <Link
                to="/calculator"
                className={`transition-colors ${
                  isActive("/calculator") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Kalkulatori
              </Link>
              <Link
                to="/recommendations"
                className={`transition-colors ${
                  isActive("/recommendations")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Rekomandimet
              </Link>
              <Link
                to="/exercises"
                className={`transition-colors ${
                  isActive("/exercises") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Stërvitjet
              </Link>
              <Link
                to="/progress"
                className={`transition-colors ${
                  isActive("/progress") ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Progresi
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30 mt-auto">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Planner Shëndeti. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>
    </div>
  )
}
