import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import GoalsPage from "./pages/GoalsPage"
import CalculatorPage from "./pages/CalculatorPage"
import RecommendationsPage from "./pages/RecommendationsPage"
import ExercisesPage from "./pages/ExercisesPage"
import ProgressPage from "./pages/ProgressPage"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </Layout>
  )
}

export default App
