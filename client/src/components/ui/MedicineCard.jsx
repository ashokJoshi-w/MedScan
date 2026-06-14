import LangToggle from './LangToggle'
import { useState } from 'react'

const MedicineCard = ({ medicine }) => {
  const [lang, setLang] = useState('en')

  const sideEffects = lang === 'en' ? medicine.side_effects_en : medicine.side_effects_hi

  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">{medicine.name}</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
            {medicine.dosage}
          </span>
        </div>
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
            {lang === 'en' ? 'Purpose' : 'उद्देश्य'}
          </p>
          <p className="text-sm text-slate-700">
            {lang === 'en' ? medicine.purpose_en : medicine.purpose_hi}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
            {lang === 'en' ? 'How to take' : 'कैसे लें'}
          </p>
          <p className="text-sm text-slate-700">
            {lang === 'en' ? medicine.instructions_en : medicine.instructions_hi}
          </p>
        </div>

        {sideEffects?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
              {lang === 'en' ? 'Side effects' : 'दुष्प्रभाव'}
            </p>
            <div className="flex flex-wrap gap-2">
              {sideEffects.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicineCard