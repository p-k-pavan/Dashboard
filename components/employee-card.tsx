"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Bookmark, Eye, TrendingUp, BookmarkCheck } from "lucide-react"
import type { Employee } from "@/contexts/hr-context"
import { useHR } from "@/contexts/hr-context"
import Link from "next/link"
import { toast } from "sonner"


interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { state, dispatch } = useHR()
  // const { toast } = useToast()
  const isBookmarked = state.bookmarkedIds.includes(employee.id)

  const handleBookmark = () => {
    dispatch({ type: "TOGGLE_BOOKMARK", payload: employee.id })
    toast(isBookmarked ? "Removed from Bookmarks" : "Bookmarked", {
      description: `${employee.firstName} ${employee.lastName} ${isBookmarked ? "has been removed" : "has been added"
        } to bookmarks.`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })

  }

  const handlePromote = () => {
    dispatch({ type: "PROMOTE_EMPLOYEE", payload: employee.id })
    toast("Promotion Success", {
      description: `${employee.firstName} ${employee.lastName} has been promoted.`,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (rating >= 3.5) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={employee.image || "/placeholder.svg"}
              alt={`${employee.firstName} ${employee.lastName}`}
            />
            <AvatarFallback>
              {employee.firstName[0]}
              {employee.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {employee.firstName} {employee.lastName}
              </h3>
              <Button variant="ghost" size="icon" onClick={handleBookmark} className="flex-shrink-0">
                {isBookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
            <p className="text-sm text-muted-foreground">Age: {employee.age}</p>

            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="secondary">{employee.company.department}</Badge>
              <Badge className={getRatingColor(employee.rating)}>{employee.rating.toFixed(1)}</Badge>
            </div>

            <div className="mt-3 flex items-center space-x-1">
              {renderStars(employee.rating)}
              <span className="ml-2 text-sm text-muted-foreground">({employee.rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between">
        <Link href={`/employee/${employee.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>

        <Button variant="default" size="sm" onClick={handlePromote}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Promote
        </Button>
      </CardFooter>
    </Card>
  )
}
