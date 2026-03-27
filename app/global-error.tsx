'use client'

import { Button } from '@/components/ui/Button'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="pt">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-2xl font-semibold">Erro crítico na aplicação</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Não foi possível renderizar a aplicação corretamente.
          </p>
          {error?.digest ? (
            <p className="text-xs text-muted-foreground">ID do erro: {error.digest}</p>
          ) : null}
          <Button onClick={reset}>Recarregar</Button>
        </main>
      </body>
    </html>
  )
}
