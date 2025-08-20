"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Trash2, LogOut, Plus, Calendar } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function Home() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  // ✅ Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) router.push("/login")
    else fetchTodos()
  }, [])

  // ✅ Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos")
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error("Error fetching todos", err)
    }
  }

  // ✅ Add a new todo
  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error("Title is required")

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status: "pending" }),
    })

    setTitle("")
    setDescription("")
    toast.success("Task created successfully ✅")
    fetchTodos()
  }

  // ✅ Delete todo
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    toast.success("Task deleted 🗑️")
    fetchTodos()
  }

  // ✅ Mark as completed
  const markCompleted = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    })
    toast.success("Task marked as completed 🎉")
    fetchTodos()
  }

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const completedTodos = todos.filter((todo) => todo.status === "completed")
  const pendingTodos = todos.filter((todo) => todo.status === "pending")

  return (
    <div className="min-h-screen bg-green-400 ">
      <Toaster position="top-right" />

      <div className="flex justify-center items-start min-h-screen py-8">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ✨ My Tasks
              </h1>
              <p className="text-muted-foreground mt-2 bg-blue-500">
                Stay organized and productive with your personal task manager
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2 justify-center sm:justify-start">
              <Plus size={20} className="text-primary" />
              Add New Task
            </h2>
            <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={18} />
                Add Task
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-primary">{todos.length}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-accent">{pendingTodos.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedTodos.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>

          <div className="space-y-6">
            {pendingTodos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar size={18} className="text-accent" />
                  Pending Tasks ({pendingTodos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTodos.map((todo) => (
                    <div
                      key={todo._id}
                      className="group bg-card rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 h-fit"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-card-foreground text-lg mb-1">{todo.title}</h4>
                          {todo.description && (
                            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{todo.description}</p>
                          )}
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                            Pending
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => markCompleted(todo._id)}
                            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Mark as completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 justify-center sm:justify-start">
                  <CheckCircle size={18} className="text-primary" />
                  Completed Tasks ({completedTodos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTodos.map((todo) => (
                    <div
                      key={todo._id}
                      className="group bg-card/50 rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200 h-fit"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-muted-foreground text-lg mb-1 line-through">
                            {todo.title}
                          </h4>
                          {todo.description && (
                            <p className="text-muted-foreground/70 text-sm mb-3 leading-relaxed line-through">
                              {todo.description}
                            </p>
                          )}
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            ✓ Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {todos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">Create your first task to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
