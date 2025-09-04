"use client"

import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "../../../components/radix/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/radix/dropdown-menu"
import { useAppSelector } from "../../../lib/hooks/redux"
import { toast } from "../../../lib/hooks/use-toast"

export function TaskExport() {
  const { todos } = useAppSelector((state) => state.todos)

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tasks-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Export Complete",
      description: "Tasks exported as JSON file",
    })
  }

  const exportAsCSV = () => {
    const headers = ["ID", "Task", "Completed", "User ID"]
    const csvContent = [
      headers.join(","),
      ...todos.map((todo) => [todo.id, `"${todo.todo.replace(/"/g, '""')}"`, todo.completed, todo.userId].join(",")),
    ].join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tasks-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Export Complete",
      description: "Tasks exported as CSV file",
    })
  }

  if (todos.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2">
          <FileText className="h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
