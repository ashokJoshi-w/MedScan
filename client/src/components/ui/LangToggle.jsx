const LangToggle = ({ lang, setLang }) => {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
      {['en', 'hi'].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
            lang === l
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-muted hover:text-slate-700'
          }`}
        >
          {l === 'en' ? 'EN' : 'हि'}
        </button>
      ))}
    </div>
  )
}

export default LangToggle