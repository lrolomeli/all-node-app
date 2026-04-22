export function parseCSVLine(line) {
  const out = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') { inQ = !inQ; continue }
    if (!inQ && c === ',') { out.push(cur); cur = ''; continue }
    cur += c
  }
  out.push(cur)
  return out
}

export function buildRoutineFromCsvText(text) {
  const next = {}
  const lines = text.trim().split(/\r?\n/).slice(1)
  lines.forEach((line) => {
    if (!line.trim()) return
    const parts = parseCSVLine(line)
    if (parts.length < 4) return
    const bloque = (parts[0] || '').trim()
    const diaRaw = (parts[1] || '').trim()
    const muscle = (parts[2] || '').trim()
    const ejercicio = (parts[3] || '').trim()
    const series = (parts[4] || '').trim()
    const repeticiones = (parts[5] || '').trim()
    const notas = parts.slice(6).join(',').trim()
    if (!bloque || !diaRaw || !ejercicio) return
    const d = parseInt(diaRaw, 10)
    if (isNaN(d)) return
    if (!next[bloque]) next[bloque] = {}
    if (!next[bloque][d]) next[bloque][d] = []
    next[bloque][d].push({ name: ejercicio, muscle, sets: series, reps: repeticiones, notes: notas })
  })
  return next
}

export function routineToFlat(r) {
  const rows = []
  const blocks = Object.keys(r).sort()
  for (const b of blocks) {
    const days = Object.keys(r[b] || {}).map(Number).sort((a, c) => a - c)
    for (const d of days) {
      for (const ex of r[b][d] || []) {
        rows.push({ bloque: b, dia: d, muscle: ex.muscle || '', name: ex.name || '', sets: ex.sets || '', reps: ex.reps || '', notes: ex.notes || '' })
      }
    }
  }
  return rows
}

export function escapeCsvField(val) {
  const s = String(val ?? '')
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export function rowsToCsv(rows) {
  const header = 'bloque,dia,muscle,ejercicio,series,repeticiones,notas'
  const lines = [header]
  for (const row of rows) {
    const b = String(row.bloque || '').trim()
    const d = row.dia === '' || row.dia == null ? '' : String(row.dia)
    const name = String(row.name || '').trim()
    if (!b || !d || !name) continue
    lines.push([
      escapeCsvField(b), escapeCsvField(d), escapeCsvField(row.muscle || ''),
      escapeCsvField(name), escapeCsvField(row.sets || ''),
      escapeCsvField(row.reps || ''), escapeCsvField(row.notes || ''),
    ].join(','))
  }
  return lines.join('\n') + '\n'
}
