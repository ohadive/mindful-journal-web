import { format } from 'date-fns'

export interface ExportEntry {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  wordCount: number
  isPrivate: boolean
  isFavorite: boolean
}

export interface ExportOptions {
  includeMetadata?: boolean
  includePrivate?: boolean
  dateFormat?: string
}

export const exportEntryAsMarkdown = (
  entry: ExportEntry,
  options: ExportOptions = {}
): string => {
  const { includeMetadata = true, dateFormat = 'yyyy-MM-dd HH:mm:ss' } = options
  
  let markdown = `# ${entry.title}\n\n`
  
  if (includeMetadata) {
    markdown += `---\n`
    markdown += `Created: ${format(new Date(entry.createdAt), dateFormat)}\n`
    markdown += `Updated: ${format(new Date(entry.updatedAt), dateFormat)}\n`
    markdown += `Word Count: ${entry.wordCount}\n`
    markdown += `Private: ${entry.isPrivate ? 'Yes' : 'No'}\n`
    markdown += `Favorite: ${entry.isFavorite ? 'Yes' : 'No'}\n`
    markdown += `---\n\n`
  }
  
  // Convert HTML to Markdown (basic conversion)
  const contentMarkdown = htmlToMarkdown(entry.content)
  markdown += contentMarkdown
  
  return markdown
}

export const exportAllEntriesAsMarkdown = (
  entries: ExportEntry[],
  options: ExportOptions = {}
): Record<string, string> => {
  const { includePrivate = false } = options
  
  const filteredEntries = includePrivate 
    ? entries 
    : entries.filter(entry => !entry.isPrivate)
  
  const markdownFiles: Record<string, string> = {}
  
  filteredEntries.forEach(entry => {
    const safeTitle = entry.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
    const filename = `${format(new Date(entry.createdAt), 'yyyy-MM-dd')}-${safeTitle.replace(/\s+/g, '-')}.md`
    markdownFiles[filename] = exportEntryAsMarkdown(entry, options)
  })
  
  return markdownFiles
}

const htmlToMarkdown = (html: string): string => {
  // Basic HTML to Markdown conversion
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
    .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
    .replace(/\n\n\n+/g, '\n\n') // Clean up multiple newlines
    .trim()
}

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const createZipFile = async (files: Record<string, string>): Promise<Blob> => {
  // Simple ZIP creation without external dependencies
  // This is a basic implementation - for production, consider using a library like JSZip
  const zipContent = new Uint8Array(0)
  
  // For now, we'll create a simple archive format
  // In a real implementation, you'd want to use a proper ZIP library
  let archiveContent = '# Journal Entries Archive\n\n'
  archiveContent += `Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\n\n`
  
  Object.entries(files).forEach(([filename, content]) => {
    archiveContent += `## ${filename}\n\n`
    archiveContent += content
    archiveContent += '\n\n---\n\n'
  })
  
  return new Blob([archiveContent], { type: 'text/plain' })
}

export const exportEntryAsPDF = async (entry: ExportEntry): Promise<Blob> => {
  // For PDF export, we'll create an HTML version and let the browser handle PDF conversion
  // In a real implementation, you might want to use a library like jsPDF or Puppeteer
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${entry.title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
          }
          .metadata { 
            background: #f5f5f5; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px;
            font-size: 14px;
          }
          .content { 
            font-size: 16px; 
          }
          h1 { 
            color: #333; 
            border-bottom: 2px solid #eee; 
            padding-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${entry.title}</h1>
        <div class="metadata">
          <p><strong>Created:</strong> ${format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
          <p><strong>Updated:</strong> ${format(new Date(entry.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</p>
          <p><strong>Word Count:</strong> ${entry.wordCount}</p>
          <p><strong>Private:</strong> ${entry.isPrivate ? 'Yes' : 'No'}</p>
          <p><strong>Favorite:</strong> ${entry.isFavorite ? 'Yes' : 'No'}</p>
        </div>
        <div class="content">
          ${entry.content}
        </div>
      </body>
    </html>
  `
  
  return new Blob([html], { type: 'text/html' })
}