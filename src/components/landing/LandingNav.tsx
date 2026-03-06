import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-md'
          : 'bg-background'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Compound</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#concepts"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Core Concepts
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="https://github.com/yourusername/compound"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/app">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col space-y-6 mt-8">
              <a
                href="#concepts"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Core Concepts
              </a>
              <a
                href="#features"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="https://github.com/yourusername/compound"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
              <div className="pt-4 border-t">
                <Link to="/app">
                  <Button size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
