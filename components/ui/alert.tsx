import { cn } from '../../lib/utils'

interface AlertProps {
  role?: 'alert' | 'status'
  variant?: 'error' | 'success' | 'warning' | 'info'
  title?: string
  description?: string
  className?: string
}

export function Alert({ role = 'alert', variant = 'info', title, description, className }: AlertProps) {
  const base = 'w-full rounded-md p-3 text-sm'
  const variants: Record<string, string> = {
    error: 'bg-red-50 text-red-800 border border-red-200',
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  }
  return (
    <div role={role} aria-live={role === 'alert' ? 'assertive' : 'polite'} className={cn(base, variants[variant], className)}>
      {title && <div className="font-medium">{title}</div>}
      {description && <div className="mt-1">{description}</div>}
    </div>
  )
}


