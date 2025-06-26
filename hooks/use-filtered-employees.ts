"use client"

import { useMemo } from "react"
import { useHR } from "@/contexts/hr-context"

export function useFilteredEmployees() {
  const { state } = useHR()
  const { employees, searchTerm, departmentFilter, ratingFilter } = state

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.company.department.toLowerCase().includes(searchTerm.toLowerCase())

      // Department filter
      const matchesDepartment = departmentFilter.length === 0 || departmentFilter.includes(employee.company.department)

      // Rating filter
      const matchesRating =
        ratingFilter.length === 0 || ratingFilter.some((rating) => Math.floor(employee.rating) === rating)

      return matchesSearch && matchesDepartment && matchesRating
    })
  }, [employees, searchTerm, departmentFilter, ratingFilter])

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((emp) => emp.company.department)))
  }, [employees])

  return {
    filteredEmployees,
    departments,
    totalEmployees: employees.length,
    filteredCount: filteredEmployees.length,
  }
}