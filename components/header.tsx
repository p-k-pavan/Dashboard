"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Moon, Sun, Menu, User, LogOut, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { useHR } from "@/contexts/hr-context"
import { useFilteredEmployees } from "@/hooks/use-filtered-employees"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { state, dispatch } = useHR()
  const { departments } = useFilteredEmployees()
  const { data: session } = useSession()
  const router = useRouter()

  const handleSearchChange = (value: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: value })
  }

  const handleDepartmentFilter = (department: string, checked: boolean) => {
    const current = state.departmentFilter
    const updated = checked ? [...current, department] : current.filter((d) => d !== department)
    dispatch({ type: "SET_DEPARTMENT_FILTER", payload: updated })
  }

  const handleRatingFilter = (rating: number, checked: boolean) => {
    const current = state.ratingFilter
    const updated = checked ? [...current, rating] : current.filter((r) => r !== rating)
    dispatch({ type: "SET_RATING_FILTER", payload: updated })
  }

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={state.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(state.departmentFilter.length > 0 || state.ratingFilter.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {state.departmentFilter.length + state.ratingFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Department</DropdownMenuLabel>
              {departments.map((department) => (
                <DropdownMenuCheckboxItem
                  key={department}
                  checked={state.departmentFilter.includes(department)}
                  onCheckedChange={(checked) => handleDepartmentFilter(department, checked)}
                >
                  {department}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Rating</DropdownMenuLabel>
              {[5, 4, 3, 2, 1].map((rating) => (
                <DropdownMenuCheckboxItem
                  key={rating}
                  checked={state.ratingFilter.includes(rating)}
                  onCheckedChange={(checked) => handleRatingFilter(rating, checked)}
                >
                  {rating} Stars
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark"
              setTheme(nextTheme)
              toast("Theme Changed", {
                description: `Switched to ${nextTheme} mode.`,
              })
            }}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {session?.user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {session?.user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/setting")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast("Logged out", {
                        description: "You have been signed out successfully.",
                      })
                      signOut({ callbackUrl: "/auth" })
                    }} >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => signIn()}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}