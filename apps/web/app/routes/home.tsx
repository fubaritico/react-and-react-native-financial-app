import { Button, Card, Header } from '@financial-app/ui'

import type { Route } from './+types/home'

export function loader() {
  return {
    title: 'Finance Web',
    subtitle: 'Cross-platform design system',
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header title={loaderData.title} subtitle={loaderData.subtitle} />
      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <Card
          title="Welcome"
          text="This card comes from the shared design system."
        />
        <Card title="Actions">
          <div className="space-y-2">
            <Button
              title="Primary"
              onPress={() => {
                alert('Primary!')
              }}
            />
            <Button
              title="Secondary"
              variant="secondary"
              onPress={() => {
                alert('Secondary!')
              }}
            />
            <Button
              title="Outline"
              variant="outline"
              onPress={() => {
                alert('Outline!')
              }}
            />
          </div>
        </Card>
      </main>
    </div>
  )
}
