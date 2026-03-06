import { FileText, Link2, Layers } from 'lucide-react'
import { Card } from '@/components/ui/card'

const concepts = [
  {
    icon: FileText,
    title: 'Document-first',
    description:
      'Knowledge lives in documents, not chats. Documents are graphs of addressable nodes, not markdown blobs.',
  },
  {
    icon: Link2,
    title: 'Reference over duplication',
    description:
      'Reuse happens by reference, never copy. Transclusions stay live and editable — no content forks.',
  },
  {
    icon: Layers,
    title: 'Exploration ≠ Authority',
    description:
      'Messy exploration and authoritative spec never fork. Spec is composed entirely of references to Exploration.',
  },
]

export function CoreConcepts() {
  return (
    <section id="concepts" className="container mx-auto px-4 py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Core Concepts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compound is built on three non-negotiable principles.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {concepts.map((concept) => {
            const Icon = concept.icon
            return (
              <Card
                key={concept.title}
                className="p-6 space-y-4 border-border hover:border-foreground/20 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{concept.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {concept.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
