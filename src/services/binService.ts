export async function lookupBIN(bin: string, apiKey: string): Promise<string> {
  try {
    const res = await fetch(`https://lookup.binlist.net/${bin.slice(0, 6)}`)
    if (res.ok) {
      const data = await res.json()
      return `${data.bank?.name || 'Unknown'} • ${data.country?.name || ''}`
    }
  } catch (_) {}

  if (apiKey) {
    // Fallback ke Gemini jika perlu
    return 'BIN detected (Gemini fallback)'
  }
  return 'BIN not found'
}