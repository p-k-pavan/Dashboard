"use client"

import { useHR } from "@/contexts/hr-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Award } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  const { state } = useHR()

  // Department-wise analytics
  const departmentData = state.employees.reduce(
    (acc, emp) => {
      const dept = emp.company.department
      if (!acc[dept]) {
        acc[dept] = { department: dept, employees: 0, totalRating: 0, avgRating: 0 }
      }
      acc[dept].employees += 1
      acc[dept].totalRating += emp.rating
      acc[dept].avgRating = acc[dept].totalRating / acc[dept].employees
      return acc
    },
    {} as Record<string, any>,
  )

  const departmentChartData = Object.values(departmentData).map((dept: any) => ({
    department: dept.department.slice(0, 10),
    avgRating: Math.round(dept.avgRating * 10) / 10,
    employees: dept.employees,
  }))

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} Star${rating > 1 ? "s" : ""}`,
    count: state.employees.filter((emp) => Math.floor(emp.rating) === rating).length,
  }))

  // Performance trends (mock monthly data)
  const performanceTrends = [
    { month: "Jan", avgRating: 3.8, bookmarks: 5 },
    { month: "Feb", avgRating: 4.0, bookmarks: 8 },
    { month: "Mar", avgRating: 4.1, bookmarks: 12 },
    { month: "Apr", avgRating: 4.2, bookmarks: 15 },
    { month: "May", avgRating: 4.3, bookmarks: 18 },
    { month: "Jun", avgRating: 4.4, bookmarks: state.bookmarkedIds.length },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const totalEmployees = state.employees.length
  const avgRating = totalEmployees > 0 ? state.employees.reduce((sum, emp) => sum + emp.rating, 0) / totalEmployees : 0
  const topPerformers = state.employees.filter((emp) => emp.rating >= 4.5).length
  const bookmarkRate = totalEmployees > 0 ? (state.bookmarkedIds.length / totalEmployees) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Performance insights and trends</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers}</div>
            <p className="text-xs text-muted-foreground">
              4.5+ rating ({((topPerformers / totalEmployees) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmark Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarkRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{state.bookmarkedIds.length} bookmarked</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgRating: {
                  label: "Average Rating",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} stars`, "Average Rating"]}
                  />
                  <Bar dataKey="avgRating" fill="var(--color-avgRating)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Employees",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, count }) => `${rating}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              avgRating: {
                label: "Average Rating",
                color: "hsl(var(--chart-1))",
              },
              bookmarks: {
                label: "Bookmarks",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="avgRating"
                  stroke="var(--color-avgRating)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="bookmarks"
                  stroke="var(--color-bookmarks)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Department Details */}
      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(departmentData).map((dept: any) => (
              <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{dept.department}</h4>
                  <p className="text-sm text-muted-foreground">
                    {dept.employees} employee{dept.employees !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{dept.avgRating.toFixed(1)} ⭐</div>
                  <p className="text-sm text-muted-foreground">Average rating</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}