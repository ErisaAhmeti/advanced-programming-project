const API_BASE_URL = "http://localhost:3001/api"

// Generic API function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log("[v0] API Request:", url, config.method || "GET")
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] API Response:", data)
    return data
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

// User API functions
export const userApi = {
  getAll: () => apiRequest<any[]>("/users"),
  getById: (id: string) => apiRequest<any>(`/users/${id}`),
  create: (userData: any) =>
    apiRequest<any>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  update: (id: string, userData: any) =>
    apiRequest<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  delete: (id: string) =>
    apiRequest<any>(`/users/${id}`, {
      method: "DELETE",
    }),
}

// Goal API functions
export const goalApi = {
  getAll: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : ""
    return apiRequest<any[]>(`/goals${query}`)
  },
  getById: (id: string) => apiRequest<any>(`/goals/${id}`),
  create: (goalData: any) =>
    apiRequest<any>("/goals", {
      method: "POST",
      body: JSON.stringify(goalData),
    }),
  update: (id: string, goalData: any) =>
    apiRequest<any>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goalData),
    }),
  updateProgress: (id: string, currentValue: number) =>
    apiRequest<any>(`/goals/${id}/progress`, {
      method: "PATCH",
      body: JSON.stringify({ currentValue }),
    }),
  delete: (id: string) =>
    apiRequest<any>(`/goals/${id}`, {
      method: "DELETE",
    }),
}

// Progress API functions
export const progressApi = {
  getAll: (params?: { userId?: string; startDate?: string; endDate?: string; goalId?: string }) => {
    const query = new URLSearchParams()
    if (params?.userId) query.append("userId", params.userId)
    if (params?.startDate) query.append("startDate", params.startDate)
    if (params?.endDate) query.append("endDate", params.endDate)
    if (params?.goalId) query.append("goalId", params.goalId)

    const queryString = query.toString()
    return apiRequest<any[]>(`/progress${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id: string) => apiRequest<any>(`/progress/${id}`),
  create: (progressData: any) =>
    apiRequest<any>("/progress", {
      method: "POST",
      body: JSON.stringify(progressData),
    }),
  update: (id: string, progressData: any) =>
    apiRequest<any>(`/progress/${id}`, {
      method: "PUT",
      body: JSON.stringify(progressData),
    }),
  delete: (id: string) =>
    apiRequest<any>(`/progress/${id}`, {
      method: "DELETE",
    }),
  getStats: (userId: string, days?: number) => {
    const query = days ? `?days=${days}` : ""
    return apiRequest<any>(`/progress/stats/${userId}${query}`)
  },
}

// Health check
export const healthCheck = () => apiRequest<any>("/health")
