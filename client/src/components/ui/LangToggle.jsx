const LangToggle = ({ lang, setLang }) => {
  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
      {['en', 'hi'].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
            lang === l
              ? 'bg-white text-primary shadow-sm border border-border'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          {l === 'en' ? 'EN' : 'हि'}
        </button>
      ))}
    </div>
  )
}

export default LangToggle
