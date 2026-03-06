import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center space-y-8">
        {/* Optional badge */}
        <div className="inline-block">
          <div className="rounded-full border border-border bg-muted px-3 py-1 text-sm">
            Early Access
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Where thinking, structure, and AI stay aligned
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-muted-foreground md:text-2xl">
          A document-first, local-first knowledge workspace where exploration and authority never fork.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/app">
            <Button size="lg" className="gap-2">
              Start Building Knowledge
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#concepts">
            <Button size="lg" variant="outline">
              Learn the Concepts
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
