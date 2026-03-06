import { LandingNav } from '@/components/landing/LandingNav'
import { Hero } from '@/components/landing/Hero'
import { CoreConcepts } from '@/components/landing/CoreConcepts'
import { Features } from '@/components/landing/Features'
import { CtaBand } from '@/components/landing/CtaBand'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { useEffect } from 'react'

export function LandingPage() {
  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <Hero />
        <CoreConcepts />
        <Features />
        <CtaBand />
      </main>
      <LandingFooter />
    </div>
  )
}
