import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist'
import { Loader2 } from 'lucide-react'

// Configure worker via CDN to avoid bundler issues and blockers
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

export interface PdfViewerModalProps {
  open: boolean
  setOpen: (v: boolean) => void
  data: Uint8Array | null
  title?: string
}

export default function PdfViewerModal({ open, setOpen, data, title = 'Visualizador de PDF' }: PdfViewerModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !data || !containerRef.current) return

    // Atualiza URL de download segura como fallback
    try {
      const arr = new Uint8Array(data.length)
      arr.set(data)
      const blob = new Blob([arr.buffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
    } catch (e) {
      console.warn('Falha ao criar URL de download do PDF', e)
    }

    const container = containerRef.current
    container.innerHTML = ''
    setLoading(true)
    setError(null)
    setPageCount(0)

    const render = async () => {
      try {
        console.log('Iniciando renderização do PDF...', { dataLength: data.length })
        
        const loadingTask = getDocument({ data })
        const pdf = await loadingTask.promise
        
        console.log('PDF carregado com sucesso:', { numPages: pdf.numPages })
        setPageCount(pdf.numPages)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          console.log(`Renderizando página ${pageNumber}/${pdf.numPages}`)
          
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 1.2 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          
          if (!context) {
            throw new Error('Não foi possível obter contexto do canvas')
          }
          
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.margin = '8px 0'
          canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
          container.appendChild(canvas)

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          }
          
          await page.render(renderContext).promise
        }
        
        console.log('Todas as páginas renderizadas com sucesso')
        setLoading(false)
      } catch (e) {
        console.error('Erro ao renderizar PDF:', e)
        setError(e instanceof Error ? e.message : 'Erro desconhecido ao renderizar PDF')
        setLoading(false)
        
        const msg = document.createElement('div')
        msg.className = 'text-sm text-destructive p-4 bg-destructive/10 rounded-md'
        msg.textContent = `Não foi possível renderizar o PDF: ${e instanceof Error ? e.message : 'Erro desconhecido'}`
        container.appendChild(msg)
      }
    }

    render()
    return () => {
      // Cleanup URL quando fechar
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }, [open, data])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn('max-w-5xl w-[95vw]')}> 
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {loading && `Carregando PDF... ${pageCount > 0 ? `(${pageCount} páginas)` : ''}`}
            {error && !downloadUrl && 'Erro ao carregar PDF'}
            {!loading && pageCount > 0 && `Documento com ${pageCount} página${pageCount > 1 ? 's' : ''}`}
          </DialogDescription>
        </DialogHeader>
        {/* Fallback rápido para download caso a renderização falhe em algum dispositivo */}
        {downloadUrl && (
          <div className="flex items-center justify-end">
            <a href={downloadUrl} download title="Baixar PDF" className="text-sm underline">
              Baixar PDF
            </a>
          </div>
        )}
        <ScrollArea className="h-[75vh] w-full pr-4">
          {downloadUrl ? (
            <iframe
              src={downloadUrl}
              className="w-full h-[75vh] border rounded-md"
              title="Visualização de PDF"
            />
          ) : (
            <>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-sm text-muted-foreground">
                    Renderizando PDF...
                  </span>
                </div>
              )}
              <div ref={containerRef} className="w-full flex flex-col items-center" />
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
