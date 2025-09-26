"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, Users, Target, TrendingUp } from "lucide-react"
import { healthCheck, userApi, goalApi, progressApi } from "@/lib/api"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
  data?: any
}

export function DatabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "API Health Check", status: "pending", message: "Waiting..." },
    { name: "Users API", status: "pending", message: "Waiting..." },
    { name: "Goals API", status: "pending", message: "Waiting..." },
    { name: "Progress API", status: "pending", message: "Waiting..." },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, status: TestResult["status"], message: string, data?: any) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message, data } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)

    try {
      // Test 1: Health Check
      console.log("[v0] Testing API health check...")
      const healthResult = await healthCheck()
      updateTest(0, "success", `API is running: ${healthResult.message}`, healthResult)

      // Test 2: Users API
      console.log("[v0] Testing Users API...")
      const users = await userApi.getAll()
      updateTest(1, "success", `Found ${users.length} users`, users)

      // Test 3: Goals API
      console.log("[v0] Testing Goals API...")
      const goals = await goalApi.getAll()
      updateTest(2, "success", `Found ${goals.length} goals`, goals)

      // Test 4: Progress API
      console.log("[v0] Testing Progress API...")
      const progress = await progressApi.getAll()
      updateTest(3, "success", `Found ${progress.length} progress entries`, progress)
    } catch (error) {
      console.error("[v0] Test failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      // Update failed test
      setTests((prev) =>
        prev.map((test) => (test.status === "pending" ? { ...test, status: "error", message: errorMessage } : test)),
      )
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MongoDB Integration Test
          </CardTitle>
          <CardDescription>Test the connection between the React frontend and MongoDB backend</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={isRunning} className="mb-6">
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              "Run Database Tests"
            )}
          </Button>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <h3 className="font-medium">{test.name}</h3>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{test.message}</p>

                  {test.data && test.status === "success" && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(test.data, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {tests.every((test) => test.status !== "pending") && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">
                  {tests.every((test) => test.status === "success")
                    ? "All tests passed! MongoDB integration is working correctly."
                    : "Some tests failed. Check the error messages above."}
                </h3>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests[1]?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests[2]?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests[3]?.data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Progress entries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
