function parseCSVLine(line) {
  const result = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(field.trim())
      field = ''
    } else {
      field += ch
    }
  }
  result.push(field.trim())
  return result
}

export function parseRutina(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim())
  const sessionMap = {}

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 6) continue
    const [sesion, fase, enfoque, dosis, n1, n2, n3] = cols
    const match = sesion.match(/\d+/)
    if (!match) continue
    const num = parseInt(match[0], 10)
    if (!sessionMap[num]) sessionMap[num] = []
    sessionMap[num].push({ fase, enfoque, dosis: dosis || '', niveles: [n1, n2, n3] })
  }

  return Object.keys(sessionMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map((num) => sessionMap[num])
}
