import { useState, useRef, useEffect } from 'react'
import { UploadCloud, X, FileText } from 'lucide-react'

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
  label = 'Drop file here or click to upload',
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

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files[0])
      }}
      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
        file ? 'p-4 border-gray-200 bg-gray-50/50' : 'p-8 text-center cursor-pointer'
      } ${
        dragging
          ? 'border-primary bg-primary-light'
          : 'border-gray-200 hover:border-primary/40'
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary-darker" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="w-full flex flex-col items-center cursor-pointer"
        >
          <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, PDF supported</p>
        </button>
      )}
    </div>
  )
}
