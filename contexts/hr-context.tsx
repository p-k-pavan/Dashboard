"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
  }
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  rating: number
  projects: string[]
  feedback: Array<{
    id: string
    author: string
    comment: string
    date: string
    rating: number
  }>
  performanceHistory: Array<{
    month: string
    rating: number
    goals: number
    completed: number
  }>
}

interface HRState {
  employees: Employee[]
  bookmarkedIds: number[]
  loading: boolean
  error: string | null
  searchTerm: string
  departmentFilter: string[]
  ratingFilter: number[]
}

type HRAction =
  | { type: "SET_EMPLOYEES"; payload: Employee[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "TOGGLE_BOOKMARK"; payload: number }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DEPARTMENT_FILTER"; payload: string[] }
  | { type: "SET_RATING_FILTER"; payload: number[] }
  | { type: "PROMOTE_EMPLOYEE"; payload: number }

const initialState: HRState = {
  employees: [],
  bookmarkedIds: [],
  loading: true,
  error: null,
  searchTerm: "",
  departmentFilter: [],
  ratingFilter: [],
}

function hrReducer(state: HRState, action: HRAction): HRState {
  switch (action.type) {
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload, loading: false }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "TOGGLE_BOOKMARK":
      const isBookmarked = state.bookmarkedIds.includes(action.payload)
      return {
        ...state,
        bookmarkedIds: isBookmarked
          ? state.bookmarkedIds.filter((id) => id !== action.payload)
          : [...state.bookmarkedIds, action.payload],
      }
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }
    case "SET_DEPARTMENT_FILTER":
      return { ...state, departmentFilter: action.payload }
    case "SET_RATING_FILTER":
      return { ...state, ratingFilter: action.payload }
    case "PROMOTE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp.id === action.payload ? { ...emp, rating: Math.min(5, emp.rating + 0.5) } : emp,
        ),
      }
    default:
      return state
  }
}

const HRContext = createContext<{
  state: HRState
  dispatch: React.Dispatch<HRAction>
} | null>(null)

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(hrReducer, initialState)

  useEffect(() => {
    fetchEmployees()
    loadBookmarks()
  }, [])

  useEffect(() => {
    localStorage.setItem("bookmarkedIds", JSON.stringify(state.bookmarkedIds))
  }, [state.bookmarkedIds])

  const fetchEmployees = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await fetch("https://dummyjson.com/users?limit=20")
      const data = await response.json()

      const enhancedEmployees: Employee[] = data.users.map((user: any) => ({
        ...user,
        rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
        projects: generateProjects(),
        feedback: generateFeedback(),
        performanceHistory: generatePerformanceHistory(),
      }))

      dispatch({ type: "SET_EMPLOYEES", payload: enhancedEmployees })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch employees" })
    }
  }

  const loadBookmarks = () => {
    const saved = localStorage.getItem("bookmarkedIds")
    if (saved) {
      const bookmarkedIds = JSON.parse(saved)
      bookmarkedIds.forEach((id: number) => {
        dispatch({ type: "TOGGLE_BOOKMARK", payload: id })
      })
    }
  }

  return <HRContext.Provider value={{ state, dispatch }}>{children}</HRContext.Provider>
}

export function useHR() {
  const context = useContext(HRContext)
  if (!context) {
    throw new Error("useHR must be used within HRProvider")
  }
  return context
}

function generateProjects(): string[] {
  const projects = [
    "Website Redesign",
    "Mobile App Development",
    "Database Migration",
    "API Integration",
    "Security Audit",
    "Performance Optimization",
    "User Experience Research",
    "Marketing Campaign",
    "Training Program",
  ]
  return projects.slice(0, Math.floor(Math.random() * 4) + 1)
}

function generateFeedback() {
  const authors = ["John Manager", "Sarah Lead", "Mike Director", "Lisa VP"]
  const comments = [
    "Excellent work on the recent project. Shows great leadership skills.",
    "Consistently delivers high-quality work and meets deadlines.",
    "Great team player and always willing to help colleagues.",
    "Shows initiative and brings creative solutions to problems.",
    "Strong technical skills and attention to detail.",
  ]

  return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
    id: `feedback-${i}`,
    author: authors[Math.floor(Math.random() * authors.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    rating: Math.floor(Math.random() * 2) + 4,
  }))
}

function generatePerformanceHistory() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month) => ({
    month,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    goals: Math.floor(Math.random() * 5) + 3,
    completed: Math.floor(Math.random() * 5) + 2,
  }))
}
