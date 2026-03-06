import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start building knowledge
          </h2>
          <p className="text-lg text-muted-foreground">
            Local-first. No lock-in. Your data stays yours.
          </p>
          <div className="pt-4">
            <Link to="/app">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
