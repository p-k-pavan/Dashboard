"use client"

import { useHR } from "@/contexts/hr-context"
import { EmployeeCard } from "@/components/employee-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Users } from "lucide-react"

export default function BookmarksPage() {
  const { state, dispatch } = useHR()
  const bookmarkedEmployees = state.employees.filter((emp) => state.bookmarkedIds.includes(emp.id))

  const clearAllBookmarks = () => {
    state.bookmarkedIds.forEach((id) => {
      dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bookmark className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Bookmarked Employees</h1>
            <p className="text-muted-foreground">Manage your saved employee profiles</p>
          </div>
        </div>

        {bookmarkedEmployees.length > 0 && (
          <Button variant="outline" onClick={clearAllBookmarks}>
            Clear All
          </Button>
        )}
      </div>

      {bookmarkedEmployees.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Bookmarked Employees</h3>
          <p className="text-muted-foreground mb-4">Start bookmarking employees from the dashboard to see them here.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  )
}