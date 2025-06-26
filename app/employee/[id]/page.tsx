"use client"

import { useParams } from "next/navigation"
import { useHR } from "@/contexts/hr-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, Phone, Mail, Building, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function EmployeeDetail() {
  const params = useParams()
  const { state } = useHR()
  const employeeId = Number.parseInt(params.id as string)
  const employee = state.employees.find((emp) => emp.id === employeeId)

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested employee could not be found.</p>
          <Link href="/">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="outline">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold">Employee Profile</h1>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={employee.image || "/placeholder.svg"}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback className="text-xl">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-lg text-muted-foreground">{employee.company.title}</p>
                </div>
                <div className="flex items-center space-x-1 mt-2 md:mt-0">
                  {renderStars(employee.rating)}
                  <span className="ml-2 text-lg font-semibold">{employee.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.company.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {employee.address.city}, {employee.address.state}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Badge variant="secondary" className="mr-2">
                  Age: {employee.age}
                </Badge>
                <Badge variant="outline">{employee.company.name}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.performanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{record.month}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">{renderStars(record.rating)}</div>
                        <span className="text-sm font-medium">{record.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.performanceHistory.slice(0, 3).map((record, index) => {
                    const completionRate = (record.completed / record.goals) * 100
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{record.month}</span>
                          <span>
                            {record.completed}/{record.goals} goals
                          </span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {employee.address.address}
                    <br />
                    {employee.address.city}, {employee.address.state} {employee.address.postalCode}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Company</h4>
                  <p className="text-sm text-muted-foreground">
                    {employee.company.name}
                    <br />
                    {employee.company.department}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.projects.map((project, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium mb-2">{project}</h4>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Active</Badge>
                      <Progress value={Math.random() * 100} className="w-20 h-2" />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.feedback.map((feedback) => (
                  <Card key={feedback.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{feedback.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">{renderStars(feedback.rating)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feedback.comment}</p>
                    <p className="text-xs text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}