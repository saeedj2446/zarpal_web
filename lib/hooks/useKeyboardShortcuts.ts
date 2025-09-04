"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./redux"
import { setFilter, setSearchQuery } from "../store/slices/todoSlice"

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch()
  const { filter } = useAppSelector((state) => state.todos)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Number keys for filters
      if (e.key >= "1" && e.key <= "3") {
        e.preventDefault()
        const filters = ["all", "incomplete", "completed"] as const
        const filterIndex = Number.parseInt(e.key) - 1
        if (filters[filterIndex]) {
          dispatch(setFilter(filters[filterIndex]))
        }
      }

      // Escape to clear search
      if (e.key === "Escape") {
        dispatch(setSearchQuery(""))
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.blur()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [dispatch])
}
