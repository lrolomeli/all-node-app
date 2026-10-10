import {
  Thermometer,
  Film,
  Trophy,
  Wrench,
  FileText,
} from 'lucide-react'

export const ICONS = {
  thermometer: Thermometer,
  film: Film,
  trophy: Trophy,
  wrench: Wrench,
  'file-text': FileText,
}

export function getIcon(name) {
  return ICONS[name] || null
}
