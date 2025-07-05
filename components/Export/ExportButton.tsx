import React, { useState } from 'react'
import { FaDownload, FaSpinner, FaFilePdf, FaFileArchive, FaFileAlt } from 'react-icons/fa'
import { 
  exportEntryAsMarkdown, 
  exportEntryAsPDF, 
  exportAllEntriesAsMarkdown,
  createZipFile,
  downloadFile,
  ExportEntry 
} from './ExportUtils'
import { useToast } from '../ui/Toast'
import { format } from 'date-fns'

interface ExportButtonProps {
  entry?: ExportEntry
  entries?: ExportEntry[]
  type: 'single' | 'all'
  className?: string
}

export default function ExportButton({ entry, entries, type, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const { showToast } = useToast()

  const handleExportMarkdown = async () => {
    if (type === 'single' && entry) {
      await exportSingleAsMarkdown(entry)
    } else if (type === 'all' && entries) {
      await exportAllAsMarkdown(entries)
    }
  }

  const handleExportPDF = async () => {
    if (type === 'single' && entry) {
      await exportSingleAsPDF(entry)
    } else {
      showToast({
        type: 'info',
        title: 'PDF Export',
        message: 'PDF export is only available for individual entries'
      })
    }
  }

  const handleExportZip = async () => {
    if (type === 'all' && entries) {
      await exportAllAsZip(entries)
    } else {
      showToast({
        type: 'info',
        title: 'ZIP Export',
        message: 'ZIP export is only available for all entries'
      })
    }
  }

  const exportSingleAsMarkdown = async (entry: ExportEntry) => {
    try {
      setIsExporting(true)
      const markdown = exportEntryAsMarkdown(entry, { includeMetadata: true })
      const filename = `${format(new Date(entry.createdAt), 'yyyy-MM-dd')}-${entry.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')}.md`
      
      downloadFile(markdown, filename, 'text/markdown')
      
      showToast({
        type: 'success',
        title: 'Export Complete',
        message: `${entry.title} exported as Markdown`
      })
    } catch (error) {
      console.error('Export error:', error)
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export entry as Markdown'
      })
    } finally {
      setIsExporting(false)
      setShowOptions(false)
    }
  }

  const exportSingleAsPDF = async (entry: ExportEntry) => {
    try {
      setIsExporting(true)
      const pdfBlob = await exportEntryAsPDF(entry)
      const filename = `${format(new Date(entry.createdAt), 'yyyy-MM-dd')}-${entry.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')}.html`
      
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showToast({
        type: 'success',
        title: 'Export Complete',
        message: `${entry.title} exported as HTML (use browser's print to PDF feature)`
      })
    } catch (error) {
      console.error('Export error:', error)
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export entry as PDF'
      })
    } finally {
      setIsExporting(false)
      setShowOptions(false)
    }
  }

  const exportAllAsMarkdown = async (entries: ExportEntry[]) => {
    try {
      setIsExporting(true)
      const markdownFiles = exportAllEntriesAsMarkdown(entries, { 
        includeMetadata: true, 
        includePrivate: true 
      })
      
      if (Object.keys(markdownFiles).length === 0) {
        showToast({
          type: 'warning',
          title: 'No Entries to Export',
          message: 'No entries found to export'
        })
        return
      }

      // Create a simple archive
      const zipBlob = await createZipFile(markdownFiles)
      const filename = `journal-entries-${format(new Date(), 'yyyy-MM-dd')}.txt`
      
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      showToast({
        type: 'success',
        title: 'Export Complete',
        message: `${Object.keys(markdownFiles).length} entries exported as archive`
      })
    } catch (error) {
      console.error('Export error:', error)
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export entries'
      })
    } finally {
      setIsExporting(false)
      setShowOptions(false)
    }
  }

  const exportAllAsZip = async (entries: ExportEntry[]) => {
    await exportAllAsMarkdown(entries)
  }

  if (type === 'single' && !entry) return null
  if (type === 'all' && (!entries || entries.length === 0)) return null

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export options"
      >
        {isExporting ? (
          <FaSpinner className="w-4 h-4 animate-spin" />
        ) : (
          <FaDownload className="w-4 h-4" />
        )}
        <span>Export</span>
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowOptions(false)}
          />
          
          {/* Options Menu */}
          <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-md shadow-lg py-1 min-w-48">
            <button
              onClick={handleExportMarkdown}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <FaFileAlt className="w-4 h-4" />
              <span>
                {type === 'single' ? 'Export as Markdown' : 'Export all as Markdown'}
              </span>
            </button>
            
            {type === 'single' && (
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                <FaFilePdf className="w-4 h-4" />
                <span>Export as PDF</span>
              </button>
            )}
            
            {type === 'all' && (
              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                <FaFileArchive className="w-4 h-4" />
                <span>Export as Archive</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}