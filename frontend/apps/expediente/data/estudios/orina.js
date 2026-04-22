const orina = [
  {
    fecha: "2025-05-29",
    resultados: {
      fisico: {
        color: "Amarillo",
        aspecto: "Claro"
      },
      quimico: [
        { parametro: "Gravedad específica",    valor: "1.020",   referencia: "1.016–1.022", anormal: false },
        { parametro: "pH",                      valor: "5.00",    referencia: "4.80–7.40",   anormal: false },
        { parametro: "Esterasa leucocitaria",   valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Nitritos",                valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Proteínas",               valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Glucosa",                 valor: "Normal",   referencia: "Normal",     anormal: false },
        { parametro: "Cetonas",                 valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Urobilinógeno",           valor: "Normal",   referencia: "Normal",     anormal: false },
        { parametro: "Bilirrubinas",            valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Sangre (erit. lisados)",  valor: "10.00",   referencia: "Negativo",    anormal: true, direccion: "alta" }
      ],
      microscopico: [
        { parametro: "Leucocitos",              valor: "0–1 por campo",   referencia: "0–2",       anormal: false },
        { parametro: "Eritrocitos",             valor: "0–2 por campo",   referencia: "0–4",       anormal: false },
        { parametro: "Bacterias",               valor: "Escasas",         referencia: "Ausentes",  anormal: true },
        { parametro: "Células epiteliales no escamosas", valor: "Ausentes", referencia: "Ausentes", anormal: false },
        { parametro: "Células epiteliales escamosas",    valor: "Escasas",  referencia: "Ausentes", anormal: true },
        { parametro: "Filamento mucoide",       valor: "Ausentes",        referencia: "Ausentes",  anormal: false },
        { parametro: "Cristales",               valor: "Ausentes",        referencia: "Ausentes",  anormal: false },
        { parametro: "Levaduras",               valor: "Ausentes",        referencia: "Ausentes",  anormal: false },
        { parametro: "Cilindros hialinos",      valor: "Ausentes",        referencia: "Ausentes",  anormal: false }
      ]
    }
  },

  {
    fecha: "2026-02-25",
    equipo: "Cobas 6500",
    resultados: {
      fisico: {
        color: "Amarillo",
        aspecto: "Claro"
      },
      quimico: [
        { parametro: "Gravedad específica",    valor: "1.018",   referencia: "1.003–1.035", anormal: false },
        { parametro: "pH",                      valor: "6.00",    referencia: "5.00–9.00",   anormal: false },
        { parametro: "Esterasa leucocitaria",   valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Nitritos",                valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Proteínas",               valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Glucosa",                 valor: "Normal",   referencia: "Normal (<30 mg/dL)", anormal: false },
        { parametro: "Cetonas",                 valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Urobilinógeno",           valor: "Normal",   referencia: "Normal",     anormal: false },
        { parametro: "Bilirrubinas",            valor: "Negativo", referencia: "Negativo",   anormal: false },
        { parametro: "Sangre (erit. lisados)",  valor: "Negativo", referencia: "Negativo",   anormal: false }
      ],
      microscopico: [
        { parametro: "Leucocitos",              valor: "0 por campo",   referencia: "0–2",      anormal: false },
        { parametro: "Eritrocitos",             valor: "0 por campo",   referencia: "0–4",      anormal: false },
        { parametro: "Bacterias",               valor: "Escasas",       referencia: "Ausentes", anormal: true },
        { parametro: "Células epiteliales no escamosas", valor: "Ausentes", referencia: "Ausentes", anormal: false },
        { parametro: "Células epiteliales escamosas",    valor: "Ausentes", referencia: "Ausentes", anormal: false },
        { parametro: "Filamento mucoide",       valor: "Presentes",     referencia: "Ausentes", anormal: true },
        { parametro: "Cristales (uratos amorfos)", valor: "Escasos",   referencia: "Ausentes", anormal: true },
        { parametro: "Levaduras",               valor: "Ausentes",      referencia: "Ausentes", anormal: false },
        { parametro: "Cilindros hialinos",      valor: "Ausentes",      referencia: "Ausentes", anormal: false },
        { parametro: "Cilindros patológicos",   valor: "Ausentes",      referencia: "Ausentes", anormal: false },
        { parametro: "Espermatozoides",         valor: "Ausentes",      referencia: "Ausentes", anormal: false }
      ]
    }
  }
];
