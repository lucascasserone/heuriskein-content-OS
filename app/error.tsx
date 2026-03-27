'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/Button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold text-foreground">Algo correu mal</h2>
      <p className="max-w-xl text-sm text-muted-foreground">
        Ocorreu um erro inesperado ao carregar esta página.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
