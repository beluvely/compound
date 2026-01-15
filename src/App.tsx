import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, Code2, Palette } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Compound Stack Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            Vite + React + TypeScript + Tailwind CSS + shadcn/ui
          </p>
        </div>

        {/* Status Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                <CardTitle>TypeScript</CardTitle>
              </div>
              <CardDescription>
                Type-safe development with full IDE support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Configured and working</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Tailwind CSS</CardTitle>
              </div>
              <CardDescription>
                Utility-first CSS with custom design tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Configured and working</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <CardTitle>shadcn/ui</CardTitle>
              </div>
              <CardDescription>
                Accessible, customizable components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Button & Card installed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Showcase */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Component Showcase</CardTitle>
            <CardDescription>
              Demonstrating Button variants and styling utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Variants */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Button Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Tailwind Utilities */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Tailwind Utilities</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Spacing, typography, and color utilities are working
                  correctly.
                </p>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary" />
                  <div className="h-12 w-12 rounded-lg bg-secondary" />
                  <div className="h-12 w-12 rounded-lg bg-muted" />
                  <div className="h-12 w-12 rounded-lg bg-accent" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            All components are grayscale by default, following design system
            conventions.
          </CardFooter>
        </Card>

        {/* Tech Stack Info */}
        <Card>
          <CardHeader>
            <CardTitle>Stack Details</CardTitle>
            <CardDescription>
              Production-ready baseline configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Path aliasing configured (@/*)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>ESLint + Prettier configured</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>TypeScript strict mode enabled</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>CSS variables for theming</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>EditorConfig for consistent formatting</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
