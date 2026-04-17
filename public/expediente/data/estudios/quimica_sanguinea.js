// Química Sanguínea — paneles por fecha
// Incluye hormonales cuando vienen en el mismo panel del laboratorio
// anormal: true = fuera de rango | direccion: "alta" o "baja"
const quimicaSanguinea = [
  {
    fecha: "2025-05-01",
    tomada: "2025-05-01 11:40:05",
    validada: "2025-05-01 13:32:28",
    ayuno: false,
    tipoMuestra: "Suero",
    metodo: "Electroquimioluminiscencia",
    equipo: "Cobas 6000",
    notas: ["Muestras sin ayuno previo"],
    resultados: [
      { parametro: "Glucosa",        valor: 98.3,  unidad: "mg/dL",  refMin: 74.0,   refMax: 106.0,  anormal: false },
      { parametro: "Colesterol total", valor: 117.9, unidad: "mg/dL",  refMin: null,   refMax: 200.0,  anormal: false },
      { parametro: "Triglicéridos",  valor: 143.8, unidad: "mg/dL",  refMin: null,   refMax: 150.0,  anormal: false },
      { parametro: "TSH",            valor: 1.200, unidad: "µUI/mL", refMin: 0.270,  refMax: 4.200,  anormal: false },
      { parametro: "T3 Total",       valor: 0.93,  unidad: "ng/mL",  refMin: 0.80,   refMax: 2.00,   anormal: false },
      { parametro: "T3 Libre",       valor: 2.77,  unidad: "pg/mL",  refMin: 2.00,   refMax: 4.40,   anormal: false },
      { parametro: "T4 Total",       valor: 7.25,  unidad: "µg/dL",  refMin: 4.50,   refMax: 12.00,  anormal: false },
      { parametro: "T4 Libre",       valor: 1.21,  unidad: "ng/dL",  refMin: 0.92,   refMax: 1.68,   anormal: false }
    ]
  },

  {
    fecha: "2025-05-29",
    tomada: "2025-05-29 06:31:28",
    validada: null,
    ayuno: true,
    tipoMuestra: "Suero",
    metodo: null,
    equipo: null,
    notas: [
      "Cortisol e insulina tomados en mismo panel — hallazgos clave para hipótesis hipofisaria"
    ],
    resultados: [
      // Metabólicos
      { parametro: "Glucosa",                   valor: 111.4,  unidad: "mg/dL",  refMin: 74.0,   refMax: 106.0,  anormal: true,  direccion: "alta" },
      { parametro: "Urea",                      valor: 38.6,   unidad: "mg/dL",  refMin: 16.6,   refMax: 48.5,   anormal: false },
      { parametro: "BUN",                       valor: 18.0,   unidad: "mg/dL",  refMin: 6.0,    refMax: 20.0,   anormal: false },
      { parametro: "Creatinina",                valor: 0.99,   unidad: "mg/dL",  refMin: 0.70,   refMax: 1.20,   anormal: false },
      { parametro: "BUN/Creatinina",            valor: 18.2,   unidad: null,     refMin: 6.0,    refMax: 25.0,   anormal: false },
      { parametro: "Ácido úrico",               valor: 5.8,    unidad: "mg/dL",  refMin: 3.4,    refMax: 7.0,    anormal: false },
      // Lípidos
      { parametro: "Colesterol total",          valor: 160.9,  unidad: "mg/dL",  refMin: null,   refMax: 200.0,  anormal: false },
      { parametro: "Triglicéridos",             valor: 205.7,  unidad: "mg/dL",  refMin: null,   refMax: 150.0,  anormal: true,  direccion: "alta" },
      { parametro: "Colesterol HDL",            valor: 29.8,   unidad: "mg/dL",  refMin: 55.0,   refMax: null,   anormal: true,  direccion: "baja" },
      { parametro: "Colesterol LDL",            valor: 106.0,  unidad: "mg/dL",  refMin: null,   refMax: 100.0,  anormal: true,  direccion: "alta" },
      { parametro: "Colesterol VLDL",           valor: 41.14,  unidad: "mg/dL",  refMin: 16.52,  refMax: 33.96,  anormal: true,  direccion: "alta", nota: "Método enzimático" },
      { parametro: "Relación LDL/HDL",          valor: 3.56,   unidad: null,     refMin: null,   refMax: 3.00,   anormal: true,  direccion: "alta" },
      { parametro: "Índice aterogénico",        valor: 5.4,    unidad: null,     refMin: null,   refMax: 4.5,    anormal: true,  direccion: "alta" },
      // Hepáticos
      { parametro: "Bilirrubina total",         valor: 0.36,   unidad: "mg/dL",  refMin: null,   refMax: 1.00,   anormal: false },
      { parametro: "Bilirrubina directa",       valor: 0.13,   unidad: "mg/dL",  refMin: 0.00,   refMax: 0.30,   anormal: false },
      { parametro: "Bilirrubina indirecta",     valor: 0.23,   unidad: "mg/dL",  refMin: 0.10,   refMax: 1.23,   anormal: false },
      { parametro: "AST (TGO)",                 valor: 34.6,   unidad: "U/L",    refMin: 10.0,   refMax: 50.0,   anormal: false },
      { parametro: "ALT (TGP)",                 valor: 41.2,   unidad: "U/L",    refMin: 10.0,   refMax: 50.0,   anormal: false },
      { parametro: "GGT",                       valor: 13.0,   unidad: "U/L",    refMin: null,   refMax: 60.0,   anormal: false },
      { parametro: "ALP (Fosfatasa alcalina)",  valor: 69.0,   unidad: "U/L",    refMin: 40.0,   refMax: 129.0,  anormal: false },
      { parametro: "LDH",                       valor: 193.3,  unidad: "U/L",    refMin: null,   refMax: 480.0,  anormal: false },
      { parametro: "Proteínas totales",         valor: 6.7,    unidad: "g/dL",   refMin: 6.4,    refMax: 8.3,    anormal: false },
      { parametro: "Albúmina",                  valor: 4.44,   unidad: "g/dL",   refMin: 3.97,   refMax: 4.94,   anormal: false },
      { parametro: "Globulina",                 valor: 2.23,   unidad: "g/dL",   refMin: 2.50,   refMax: 3.50,   anormal: true,  direccion: "baja" },
      { parametro: "Relación A/G",              valor: 2.0,    unidad: null,     refMin: 1.2,    refMax: 2.1,    anormal: false },
      // Minerales
      { parametro: "Calcio",                    valor: 9.8,    unidad: "mg/dL",  refMin: 8.6,    refMax: 10.0,   anormal: false },
      { parametro: "Fósforo",                   valor: 4.5,    unidad: "mg/dL",  refMin: 2.5,    refMax: 4.5,    anormal: false },
      { parametro: "Magnesio",                  valor: 2.2,    unidad: "mg/dL",  refMin: 1.6,    refMax: 2.6,    anormal: false },
      { parametro: "Hierro",                    valor: 138.6,  unidad: "µg/dL",  refMin: 33.0,   refMax: 193.0,  anormal: false },
      // Enzimas pancreáticas
      { parametro: "Amilasa",                   valor: 46.70,  unidad: "U/L",    refMin: 28.00,  refMax: 100.00, anormal: false },
      { parametro: "Lipasa",                    valor: 19.92,  unidad: "U/L",    refMin: 13.00,  refMax: 60.00,  anormal: false },
      // Electrolitos
      { parametro: "Sodio",                     valor: 143.0,  unidad: "mmol/L", refMin: 136.0,  refMax: 145.0,  anormal: false },
      { parametro: "Potasio",                   valor: 5.0,    unidad: "mmol/L", refMin: 3.5,    refMax: 5.1,    anormal: false },
      { parametro: "Cloruro",                   valor: 103.9,  unidad: "mmol/L", refMin: 98.0,   refMax: 107.0,  anormal: false },
      // Especiales
      { parametro: "HbA1c",                     valor: 6.0,    unidad: "%",      refMin: null,   refMax: 5.7,    anormal: true,  direccion: "alta", nota: "Rango prediabetes: 5.7–6.4%" },
      { parametro: "TSH",                       valor: 2.600,  unidad: "µUI/mL", refMin: 0.270,  refMax: 4.200,  anormal: false },
      // Hormonales (mismo panel)
      { parametro: "Cortisol sérico",           valor: 20.40,  unidad: "µg/dL",  refMin: 10.0,   refMax: 25.0,   anormal: false, nota: "Matutino. Normal basal — no descarta insuficiencia suprarrenal central parcial. Requiere prueba de estimulación con ACTH." },
      { parametro: "Insulina sérica",           valor: 3.58,   unidad: "µIU/mL", refMin: 2.60,   refMax: 24.90,  anormal: false, nota: "Límite inferior. Descarta hiperinsulinismo como causa de hipoglucemias." }
    ]
  },

  {
    fecha: "2026-02-25",
    tomada: "2026-02-25 06:02:37",
    validada: "2026-02-25 11:21:14",
    ayuno: true,
    tipoMuestra: "Suero",
    metodo: "Fotometría / Ion selectivo",
    equipo: "Cobas Pro",
    notas: [
      "Cambio de valores de referencia en varios parámetros a partir de enero 2026",
      "LDL cuantificado directamente por método enzimático (no fórmula de Friedewald)"
    ],
    resultados: [
      // Metabólicos
      { parametro: "Glucosa",                   valor: 107.0,  unidad: "mg/dL",  refMin: 74.0,   refMax: 106.0,  anormal: true,  direccion: "alta" },
      { parametro: "Urea",                      valor: 40.8,   unidad: "mg/dL",  refMin: 16.6,   refMax: 48.5,   anormal: false },
      { parametro: "BUN",                       valor: 19.1,   unidad: "mg/dL",  refMin: 6.0,    refMax: 20.0,   anormal: false },
      { parametro: "Creatinina",                valor: 1.16,   unidad: "mg/dL",  refMin: 0.70,   refMax: 1.20,   anormal: false },
      { parametro: "BUN/Creatinina",            valor: 16.4,   unidad: null,     refMin: 6.0,    refMax: 25.0,   anormal: false },
      { parametro: "Ácido úrico",               valor: 7.79,   unidad: "mg/dL",  refMin: 3.4,    refMax: 7.0,    anormal: true,  direccion: "alta" },
      // Lípidos
      { parametro: "Colesterol total",          valor: 166.0,  unidad: "mg/dL",  refMin: null,   refMax: 200.0,  anormal: false },
      { parametro: "Triglicéridos",             valor: 105.0,  unidad: "mg/dL",  refMin: null,   refMax: 150.0,  anormal: false },
      { parametro: "Colesterol HDL",            valor: 68.4,   unidad: "mg/dL",  refMin: 55.0,   refMax: null,   anormal: false, nota: "Masculino sin riesgo: >55" },
      { parametro: "Colesterol LDL",            valor: 90.5,   unidad: "mg/dL",  refMin: null,   refMax: 100.0,  anormal: false, nota: "Método enzimático directo" },
      { parametro: "Colesterol VLDL",           valor: 21.00,  unidad: "mg/dL",  refMin: 16.52,  refMax: 33.96,  anormal: false },
      { parametro: "Relación LDL/HDL",          valor: 1.32,   unidad: null,     refMin: null,   refMax: 3.00,   anormal: false },
      { parametro: "Índice aterogénico",        valor: 2.4,    unidad: null,     refMin: null,   refMax: 4.5,    anormal: false },
      // Hepáticos
      { parametro: "Bilirrubina total",         valor: 0.37,   unidad: "mg/dL",  refMin: null,   refMax: 1.20,   anormal: false },
      { parametro: "Bilirrubina directa",       valor: 0.16,   unidad: "mg/dL",  refMin: 0.12,   refMax: 0.42,   anormal: false },
      { parametro: "Bilirrubina indirecta",     valor: 0.21,   unidad: "mg/dL",  refMin: 0.09,   refMax: 0.65,   anormal: false },
      { parametro: "AST (TGO)",                 valor: 37.2,   unidad: "U/L",    refMin: 12.0,   refMax: 35.0,   anormal: true,  direccion: "alta" },
      { parametro: "ALT (TGP)",                 valor: 32.1,   unidad: "U/L",    refMin: 9.0,    refMax: 47.0,   anormal: false },
      { parametro: "GGT",                       valor: 11.7,   unidad: "U/L",    refMin: null,   refMax: 60.0,   anormal: false },
      { parametro: "ALP (Fosfatasa alcalina)",  valor: 81.2,   unidad: "U/L",    refMin: 40.0,   refMax: 129.0,  anormal: false },
      { parametro: "LDH",                       valor: 189.0,  unidad: "U/L",    refMin: null,   refMax: 480.0,  anormal: false },
      { parametro: "Proteínas totales",         valor: 6.3,    unidad: "g/dL",   refMin: 6.4,    refMax: 8.3,    anormal: true,  direccion: "baja" },
      { parametro: "Albúmina",                  valor: 3.84,   unidad: "g/dL",   refMin: 3.50,   refMax: 5.20,   anormal: false },
      { parametro: "Globulina",                 valor: 2.42,   unidad: "g/dL",   refMin: 2.50,   refMax: 3.50,   anormal: true,  direccion: "baja" },
      { parametro: "Relación A/G",              valor: 1.6,    unidad: null,     refMin: 1.2,    refMax: 2.1,    anormal: false },
      // Minerales
      { parametro: "Calcio",                    valor: 9.3,    unidad: "mg/dL",  refMin: 8.6,    refMax: 10.0,   anormal: false },
      { parametro: "Fósforo",                   valor: 4.0,    unidad: "mg/dL",  refMin: 2.5,    refMax: 4.5,    anormal: false },
      { parametro: "Magnesio",                  valor: 1.9,    unidad: "mg/dL",  refMin: 1.6,    refMax: 2.6,    anormal: false },
      { parametro: "Hierro",                    valor: 76.4,   unidad: "µg/dL",  refMin: 33.0,   refMax: 193.0,  anormal: false },
      // Enzimas pancreáticas
      { parametro: "Amilasa",                   valor: 56.30,  unidad: "U/L",    refMin: 28.00,  refMax: 100.00, anormal: false },
      { parametro: "Lipasa",                    valor: 24.30,  unidad: "U/L",    refMin: 13.00,  refMax: 60.00,  anormal: false },
      // Electrolitos
      { parametro: "Sodio",                     valor: 140.7,  unidad: "mmol/L", refMin: 136.0,  refMax: 145.0,  anormal: false },
      { parametro: "Potasio",                   valor: 4.6,    unidad: "mmol/L", refMin: 3.5,    refMax: 5.1,    anormal: false },
      { parametro: "Cloruro",                   valor: 102.2,  unidad: "mmol/L", refMin: 98.0,   refMax: 107.0,  anormal: false },
      // Especiales
      { parametro: "HbA1c",                     valor: 6.2,    unidad: "%",      refMin: null,   refMax: 5.7,    anormal: true,  direccion: "alta", nota: "Prediabetes: 5.7–6.4% / Diabetes: ≥6.5%" },
      { parametro: "PSA Total",                 valor: 1.59,   unidad: "ng/mL",  refMin: 0.00,   refMax: 3.10,   anormal: false },
      // Hormonales
      { parametro: "TSH",                       valor: 2.970,  unidad: "µUI/mL", refMin: 0.270,  refMax: 4.200,  anormal: false },
      { parametro: "T3 Total",                  valor: 0.63,   unidad: "ng/mL",  refMin: 0.80,   refMax: 2.00,   anormal: true,  direccion: "baja", nota: "Hallazgo clave: T3 total bajo con TSH normal — patrón de hipotiroidismo central" },
      { parametro: "T3 Libre",                  valor: 2.41,   unidad: "pg/mL",  refMin: 2.00,   refMax: 4.40,   anormal: false },
      { parametro: "T4 Total",                  valor: 5.52,   unidad: "µg/dL",  refMin: 4.50,   refMax: 12.00,  anormal: false },
      { parametro: "T4 Libre",                  valor: 1.42,   unidad: "ng/dL",  refMin: 0.92,   refMax: 1.68,   anormal: false }
    ]
  }
];
