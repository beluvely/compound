import { Hash, MessageSquare, RotateCcw, GitBranch } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Hash,
    title: 'Addressable nodes',
    description:
      'Every block has a stable ID. References point to sources, never copies. Content stays traceable.',
  },
  {
    icon: MessageSquare,
    title: 'Scoped AI',
    description:
      'AI conversations are bound to document nodes, not standalone chats. Context stays grounded.',
  },
  {
    icon: RotateCcw,
    title: 'Reversible interactions',
    description:
      'Fold, focus, and lift never destroy data. Every action is reversible. No destructive edits.',
  },
  {
    icon: GitBranch,
    title: 'Provenance-first',
    description:
      'Track the traceable origin of content. See where ideas came from without breaking flow.',
  },
]

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for compound knowledge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compound doesn't just store notes — it preserves the structure of your thinking.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="p-6 space-y-4 border-border hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
