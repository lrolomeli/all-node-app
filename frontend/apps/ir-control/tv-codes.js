// Códigos NEC del control de TV.
//
// Cada botón envía `addr`/`cmd` al ESP32 vía /api/ir/nec.
// Puedes usar hexadecimal ("0x50", "0x17") o decimal.
// Los botones con addr/cmd en null se muestran deshabilitados.
//
// Para obtener tus códigos:
//  1. Flashea receptor.ino en una placa con receptor IR (GPIO1).
//  2. Apunta el control de la TV y pulsa el botón; en el monitor Serie verás
//     "Address=0x.., Command=0x..".
//  3. Copia esos valores aquí (o guarda la trama con `save tv_power` y usa la
//     pestaña "Tramas" para enviarla por nombre).
//
// `nec_50_17` es la única trama NEC que viene por defecto en el firmware; se usa
// como ejemplo en Power hasta que pongas los códigos reales.

export const TV_BUTTONS = [
  { label: '⏻ Power', addr: '0x50', cmd: '0x17' },
  { label: 'Vol +', addr: null, cmd: null },
  { label: 'Vol −', addr: null, cmd: null },
  { label: 'Mute', addr: null, cmd: null },
  { label: 'CH +', addr: null, cmd: null },
  { label: 'CH −', addr: null, cmd: null },
  { label: '▲', addr: null, cmd: null },
  { label: '◀', addr: null, cmd: null },
  { label: 'OK', addr: null, cmd: null },
  { label: '▶', addr: null, cmd: null },
  { label: '▼', addr: null, cmd: null },
  { label: 'Back', addr: null, cmd: null },
  { label: 'Home', addr: null, cmd: null },
  { label: 'Input', addr: null, cmd: null },
];
