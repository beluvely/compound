import { create } from "zustand"
import { X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (message, type = "info", duration = 3000) => {
    const id = crypto.randomUUID()
    const toast: Toast = { id, message, type, duration }
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }))
    
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            px-4 py-3 rounded-lg shadow-lg
            flex items-center gap-3
            animate-in slide-in-from-bottom-2 duration-200
            ${toast.type === "success" ? "bg-green-50 text-green-900 border border-green-200" : ""}
            ${toast.type === "error" ? "bg-red-50 text-red-900 border border-red-200" : ""}
            ${toast.type === "info" ? "bg-blue-50 text-blue-900 border border-blue-200" : ""}
          `}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
