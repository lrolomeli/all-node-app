const coprologico = [
  {
    fecha: "2026-03-03",
    tomada: "2026-03-03 09:11:43",
    analizada: "2026-03-03 14:36:31",
    tipoMuestra: "Heces",
    metodo: "Microscopía",
    resultados: {
      fisico: [
        { parametro: "Color",                     valor: "Café",         referencia: "Marrón",      anormal: true },
        { parametro: "Olor",                      valor: "Sui generis",  referencia: "Sui generis", anormal: false },
        { parametro: "Consistencia",              valor: "Semiblanda",   referencia: "Semiblanda",  anormal: false },
        { parametro: "Presencia de moco",         valor: "Ausente",      referencia: "Ausente",     anormal: false },
        { parametro: "Sangre macroscópica",       valor: "Ausente",      referencia: "Ausente",     anormal: false },
        { parametro: "Alimentos no digeridos",    valor: "Moderados",    referencia: "Escasos",     anormal: true },
        { parametro: "Parásitos macroscópicos",   valor: "Ausente",      referencia: "Ausente",     anormal: false }
      ],
      quimico: [
        { parametro: "pH",                        valor: "6.00",    referencia: "6.00–8.00", anormal: false },
        { parametro: "Azúcares reductores",       valor: "Negativo", referencia: "Negativo",  anormal: false },
        { parametro: "Sangre oculta en heces",    valor: "Negativo", referencia: "Negativo",  anormal: false }
      ],
      microscopico: [
        { parametro: "Ácidos grasos y grasas neutras", valor: "Escasos",      referencia: "Escasos",  anormal: false },
        { parametro: "Fibras musculares y vegetales",  valor: "Escasos",      referencia: "Escasos",  anormal: false },
        { parametro: "Almidón y dextrinas",            valor: "No se observa", referencia: "Escasos", anormal: true },
        { parametro: "Cristales de Charcot-Leyden",    valor: "Ausentes",     referencia: "Ausentes", anormal: false },
        { parametro: "Microbiota",                     valor: "Mixta",        referencia: null,       anormal: false },
        { parametro: "Levaduras",                      valor: "Escasas",      referencia: "Ausentes", anormal: true },
        { parametro: "Leucocitos",                     valor: "1–2 por campo", referencia: "0–1",     anormal: true, direccion: "alta" },
        { parametro: "Eritrocitos",                    valor: "0–1 por campo", referencia: "0–1",     anormal: false },
        { parametro: "Parásitos microscópicos",        valor: "Ausentes",     referencia: "Ausentes", anormal: false }
      ]
    }
  }
];
