import { useState } from 'react'
import { Copy, Settings, Trash2 } from 'lucide-react'
import { generateCards } from './utils/cardUtils'
import { lookupBIN } from './services/binService'

interface Card {
  number: string
  month: string
  year: string
  cvv: string
  holder: string
}

function App() {
  const [bin, setBin] = useState('')
  const [month, setMonth] = useState('01')
  const [year, setYear] = useState('2026')
  const [cvvMode, setCvvMode] = useState<'random' | 'fixed'>('random')
  const [cvvFixed, setCvvFixed] = useState('123')
  const [quantity, setQuantity] = useState(5)
  const [cards, setCards] = useState<Card[]>([])
  const [bankInfo, setBankInfo] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiKey') || '')

  const handleBinChange = async (value: string) => {
    setBin(value)
    if (value.length >= 6) {
      const info = await lookupBIN(value, apiKey)
      setBankInfo(info)
    } else {
      setBankInfo('')
    }
  }

  const handleGenerate = () => {
    const generated = generateCards(bin, month, year, cvvMode, cvvFixed, quantity)
    setCards(generated)
  }

  const copyCard = (card: Card) => {
    const text = `${card.number}|${card.month}|${card.year}|${card.cvv}`
    navigator.clipboard.writeText(text)
    alert('Copied!')
  }

  const copyAll = () => {
    const text = cards.map(c => `${c.number}|${c.month}|${c.year}|${c.cvv}`).join('\n')
    navigator.clipboard.writeText(text)
    alert('All copied!')
  }

  const clearAll = () => {
    setCards([])
    setBin('')
    setBankInfo('')
  }

  const saveApiKey = () => {
    localStorage.setItem('geminiKey', apiKey)
    setShowSettings(false)
    alert('API Key saved!')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">MSBIN Trial</h1>
          <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg">
            <Settings size={18} /> Settings
          </button>
        </div>

        {/* Form */}
        <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">BIN (min 6 digit)</label>
              <input
                type="text"
                value={bin}
                onChange={(e) => handleBinChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
                placeholder="411111"
              />
              {bankInfo && <p className="text-emerald-400 text-sm mt-1">{bankInfo}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Month</label>
                <input type="text" value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm mb-1">Year</label>
                <input type="text" value={year} onChange={e => setYear(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-4 items-end">
            <div>
              <label className="block text-sm mb-1">CVV Mode</label>
              <select value={cvvMode} onChange={e => setCvvMode(e.target.value as any)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
                <option value="random">Random</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            {cvvMode === 'fixed' && (
              <input type="text" value={cvvFixed} onChange={e => setCvvFixed(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 w-24" />
            )}
            <button onClick={handleGenerate} className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg font-medium">Generate Cards</button>
            <button onClick={clearAll} className="bg-zinc-800 px-4 py-3 rounded-lg"><Trash2 size={18} /></button>
          </div>
        </div>

        {/* Results */}
        {cards.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Cards ({cards.length})</h2>
              <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg">
                <Copy size={18} /> Copy All
              </button>
            </div>
            <div className="space-y-2">
              {cards.map((card, index) => (
                <div key={index} onClick={() => copyCard(card)} className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-zinc-700">
                  <div>
                    <div className="font-mono text-lg">{card.number}</div>
                    <div className="text-sm text-zinc-400">{card.month}/{card.year} • CVV: {card.cvv}</div>
                  </div>
                  <Copy size={18} className="text-zinc-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-xl mb-4">Settings</h3>
            <input
              type="text"
              placeholder="Gemini API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={saveApiKey} className="flex-1 bg-emerald-600 py-3 rounded-lg">Save</button>
              <button onClick={() => setShowSettings(false)} className="flex-1 bg-zinc-700 py-3 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App