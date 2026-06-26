import { useState, useRef, useEffect } from 'react'
import { UploadCloud, X, FileText, Image } from 'lucide-react'

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadZone({
  onFileSelect,
  onFile,
  file: controlledFile,
  accept = 'image/*,.pdf',
  label = 'Drop your file here or click to browse',
  sublabel = 'Supports PDF, JPG, and PNG up to 10MB',
  large = false,
}) {
  const onSelect = onFileSelect || onFile
  const isControlled = controlledFile !== undefined
  const [internalFile, setInternalFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const file = isControlled ? controlledFile : internalFile

  useEffect(() => {
    if (isControlled && !controlledFile && inputRef.current) {
      inputRef.current.value = ''
    }
  }, [isControlled, controlledFile])

  const handleFile = (selected) => {
    if (!selected) return
    if (!isControlled) setInternalFile(selected)
    onSelect?.(selected)
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    if (!isControlled) setInternalFile(null)
    onSelect?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const openPicker = () => inputRef.current?.click()

  const padding = large ? 'p-12 md:p-16' : file ? 'p-5' : 'p-8'

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${padding} ${
        dragging
          ? 'border-accent-blue bg-accent-blue-soft/50'
          : file
            ? 'border-border bg-section'
            : 'border-border hover:border-primary/40 hover:bg-primary-50/20 cursor-pointer'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {file ? (
        <div className="flex items-center gap-4">
          <div className="icon-badge-green shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-ink truncate">{file.name}</p>
            <p className="text-xs text-ink-muted mt-0.5">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-ink-faint hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="w-full flex flex-col items-center cursor-pointer"
        >
          <div className={`${large ? 'w-16 h-16' : 'w-14 h-14'} icon-badge-blue mb-4`}>
            <UploadCloud className={`${large ? 'w-8 h-8' : 'w-7 h-7'}`} />
          </div>
          <p className={`${large ? 'text-base' : 'text-sm'} font-semibold text-ink`}>{label}</p>
          <p className="mt-2 text-sm text-ink-muted">{sublabel}</p>
          <div className="flex items-center gap-4 mt-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint bg-white px-3 py-1.5 rounded-lg border border-border">
              <FileText className="w-3.5 h-3.5" /> PDF
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-faint bg-white px-3 py-1.5 rounded-lg border border-border">
              <Image className="w-3.5 h-3.5" /> JPG / PNG
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
