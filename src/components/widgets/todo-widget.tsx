"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", text: "Complete project proposal", completed: false },
    { id: "2", text: "Review pull requests", completed: true },
    { id: "3", text: "Prepare for meeting", completed: false },
    { id: "4", text: "Update documentation", completed: false },
  ])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={addTodo} disabled={!newTodo.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</div>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} id={`todo-${todo.id}`} />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {todo.text}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {todos.filter((t) => t.completed).length} of {todos.length} tasks complete
      </div>
    </div>
  )
}
