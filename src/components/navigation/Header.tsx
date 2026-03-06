/**
 * Header component with Compound logo
 * Used across main views (Exploration, Spec)
 */

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showLogo?: boolean
}

export function Header({ title, subtitle, actions, showLogo = true }: HeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showLogo && (
            <img 
              src="/logo/icon.svg" 
              alt="Compound" 
              className="w-8 h-8"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
