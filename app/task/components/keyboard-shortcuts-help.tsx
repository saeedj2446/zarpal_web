"use client"

import { useState } from "react"
import { Keyboard } from "lucide-react"
import { Button } from "../../../components/radix/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/radix/dialog"

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false)

  const shortcuts = [
    { key: "Cmd/Ctrl + K", description: "Focus search input" },
    { key: "1", description: "Show all tasks" },
    { key: "2", description: "Show active tasks" },
    { key: "3", description: "Show completed tasks" },
    { key: "Escape", description: "Clear search and unfocus" },
    { key: "Enter", description: "Submit forms" },
    { key: "Drag & Drop", description: "Reorder tasks" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-background border rounded shadow-sm">{shortcut.key}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
