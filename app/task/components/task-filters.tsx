"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "../../../components/radix/input"
import { Button } from "../../../components/radix/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/radix/dropdown-menu"
import { KeyboardShortcutsHelp } from "./keyboard-shortcuts-help"
import { TaskExport } from "./task-export"
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux"
import { setFilter, setSearchQuery } from "../../../lib/store/slices/todoSlice"

export function TaskFilters() {
  const dispatch = useAppDispatch()
  const { filter, searchQuery } = useAppSelector((state) => state.todos)

  const filterOptions = [
    { value: "all" as const, label: "All Tasks", shortcut: "1" },
    { value: "incomplete" as const, label: "Active", shortcut: "2" },
    { value: "completed" as const, label: "Completed", shortcut: "3" },
  ]

  const currentFilterLabel = filterOptions.find((option) => option.value === filter)?.label || "All Tasks"

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks... (Cmd+K)"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              {currentFilterLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => dispatch(setFilter(option.value))}
                className={`${filter === option.value ? "bg-accent" : ""} flex items-center justify-between`}
              >
                <span>{option.label}</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-xs font-mono bg-muted border rounded">{option.shortcut}</kbd>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <TaskExport />
        <KeyboardShortcutsHelp />
      </div>
    </div>
  )
}
