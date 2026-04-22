import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'
import './checklist.css'

const SECTIONS = [
  {
    title: 'C Basics for embedded',
    items: [
      { id: 'c_types',     label: 'DataTypes and Sizes' },
      { id: 'c_bitwise',   label: 'bitwise Operations' },
      { id: 'c_volatile',  label: 'volatile' },
      { id: 'c_const',     label: 'const pointers' },
      { id: 'c_pointers',  label: 'pointers arithmetic' },
      { id: 'c_structs',   label: 'struct / union / enum' },
      { id: 'c_memory',    label: 'Memory static vs dynamic' },
      { id: 'c_endianness',label: 'Endianness' },
      { id: 'c_isr',       label: 'Interrupts and ISR' },
      { id: 'c_linking',   label: 'Linking: startup code, vector table' },
      { id: 'c_makefiles', label: 'basic Makefiles' },
      { id: 'c_xcompile',  label: 'Cross-compilation' },
    ],
  },
  {
    title: 'Microcontroller Design',
    items: [
      { id: 'arch_harvard',   label: 'Harvard vs Von Neumann' },
      { id: 'arch_bus',       label: 'Registers and Buses' },
      { id: 'arch_mmio',      label: 'Memory-Mapped I/O' },
      { id: 'arch_gpio',      label: 'GPIO' },
      { id: 'arch_hal',       label: 'Hardware Abstraction' },
      { id: 'arch_dma',       label: 'DMA vs Polling or ISR' },
      { id: 'arch_timers',    label: 'PLL prescalers Timers' },
      { id: 'arch_watchdog',  label: 'Watchdogs' },
      { id: 'arch_protocols', label: 'UART / SPI / I2C / CAN' },
    ],
  },
  {
    title: 'RTOS',
    items: [
      { id: 'rtos_sched', label: 'Scheduling' },
      { id: 'rtos_tasks', label: 'Tareas' },
      { id: 'rtos_sync',  label: 'Semáforos / Mutex' },
    ],
  },
  {
    title: 'Various Topics',
    items: [
      { id: 'bp_debug',        label: 'Debuggers / jtag / SWD' },
      { id: 'bp_modular',      label: 'Diseño modular' },
      { id: 'bp_misra',        label: 'MISRA C' },
      { id: 'bp_testing',      label: 'Pruebas unitarias' },
      { id: 'bp_classes',      label: 'Clases' },
      { id: 'bp_construct',    label: 'Constructores' },
      { id: 'bp_encapsulated', label: 'Encapsulamiento' },
      { id: 'bp_linkermpfile', label: 'Linker Map file' },
      { id: 'bp_git',          label: 'Git: stash, branching, cherry-pick' },
      { id: 'bp_bigO',         label: 'Big O Little O notation' },
    ],
  },
]

export default function ChecklistApp() {
  const { checking } = useAuth()
  const [state, setState] = useState({})

  useEffect(() => {
    fetch('/api/checklist', { credentials: 'include' })
      .then(r => r.json())
      .then(setState)
      .catch(console.error)
  }, [])

  async function toggle(id, checked) {
    setState(prev => ({ ...prev, [id]: checked }))
    try {
      await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, checked }),
      })
    } catch {
      setState(prev => ({ ...prev, [id]: !checked }))
    }
  }

  if (checking) return null

  return (
    <>
      <div className="back-home">
        <a href="/" className="btn-home">← Home</a>
      </div>

      <h1>✅ Checklist – Firmware Engineer</h1>

      {SECTIONS.map(section => (
        <div key={section.title}>
          <h2>{section.title}</h2>
          {section.items.map(({ id, label }) => (
            <label key={id} className="check-label">
              <input
                type="checkbox"
                checked={state[id] || false}
                onChange={e => toggle(id, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      ))}
    </>
  )
}
