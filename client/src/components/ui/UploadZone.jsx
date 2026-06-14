import { useState, useRef } from 'react'

const UploadZone = ({ onFile, accept = 'image/*,.pdf' }) => {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    onFile(file)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-200 bg-slate-50 hover:border-primary-400 hover:bg-primary-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <svg className="mx-auto mb-3 h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium text-slate-700">
          {fileName ? fileName : 'Drop file here or click to upload'}
        </p>
        <p className="mt-1 text-xs text-muted">JPG, PNG, PDF supported</p>
      </div>
    </div>
  )
}

export default UploadZone