import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import { taskService } from './services/api'

const isReadOnlyDemo = import.meta.env.VITE_DEMO_MODE === 'true'

function AppContent() {
  const [tasks, setTasks] = useState([])
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const hasLoadedInitialData = useRef(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [taskData, summaryData] = await Promise.all([
        taskService.getAll(),
        taskService.getSummary(),
      ])
      setTasks(taskData)
      setSummary(summaryData)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasLoadedInitialData.current) return
    hasLoadedInitialData.current = true
    loadData()
  }, [loadData])

  const refreshSummary = async () => {
    setSummary(await taskService.getSummary())
  }

  const handleCreate = async (task) => {
    const createdTask = await taskService.create(task)
    setTasks((currentTasks) => [createdTask, ...currentTasks])
    await refreshSummary()
  }

  const handleUpdate = async (id, task) => {
    const updatedTask = await taskService.update(id, task)
    setTasks((currentTasks) => currentTasks.map((item) => (item.id === id ? updatedTask : item)))
    await refreshSummary()
  }

  const handleStatusChange = async (id, status) => {
    const previousTask = tasks.find((task) => task.id === id)
    if (!previousTask || previousTask.status === status) return

    setTasks((currentTasks) => currentTasks.map((item) => (
      item.id === id ? { ...item, status } : item
    )))

    try {
      const updatedTask = await taskService.updateStatus(id, status)
      setTasks((currentTasks) => currentTasks.map((item) => (item.id === id ? updatedTask : item)))
    } catch (statusError) {
      setTasks((currentTasks) => currentTasks.map((item) => (
        item.id === id ? previousTask : item
      )))
      throw statusError
    }

    await refreshSummary()
  }

  const handleDelete = async (id) => {
    await taskService.delete(id)
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== id))
    await refreshSummary()
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard tasks={tasks} summary={summary} isLoading={isLoading} error={error} onRetry={loadData} />} />
        <Route path="/tasks" element={<Tasks tasks={tasks} isLoading={isLoading} error={error} onRetry={loadData} onCreate={handleCreate} onUpdate={handleUpdate} onStatusChange={handleStatusChange} onDelete={handleDelete} readOnly={isReadOnlyDemo} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
