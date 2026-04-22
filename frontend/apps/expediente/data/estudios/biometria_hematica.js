// Biometría Hemática — paneles por fecha
// anormal: true = fuera de rango | direccion: "alta" o "baja"
const biometriaHematica = [
  {
    fecha: "2025-05-29",
    tomada: "2025-05-29 06:31:28",
    analizada: "2025-05-29 07:50:31",
    laboratorio: null,
    notas: [],
    resultados: [
      { parametro: "Leucocitos",          valor: 8.18,  unidad: "10³/µL", refMin: 4.23,  refMax: 9.07,  anormal: false },
      { parametro: "Eritrocitos",         valor: 5.36,  unidad: "10⁶/µL", refMin: 4.63,  refMax: 6.08,  anormal: false },
      { parametro: "Hemoglobina",         valor: 16.90, unidad: "g/dL",   refMin: 13.70, refMax: 17.50, anormal: false },
      { parametro: "Hematocrito",         valor: 50.30, unidad: "%",      refMin: 40.10, refMax: 51.00, anormal: false },
      { parametro: "VCM",                 valor: 93.80, unidad: "fL",     refMin: 79.00, refMax: 92.20, anormal: true,  direccion: "alta" },
      { parametro: "HCM",                 valor: 31.50, unidad: "pg",     refMin: 25.70, refMax: 32.20, anormal: false },
      { parametro: "CHCM",                valor: 33.6,  unidad: "g/dL",   refMin: 32.3,  refMax: 36.5,  anormal: false },
      { parametro: "ADE-DE",              valor: 42.8,  unidad: "fL",     refMin: 35.1,  refMax: 43.9,  anormal: false },
      { parametro: "ADE-CV",              valor: 12.3,  unidad: "%",      refMin: 11.6,  refMax: 14.4,  anormal: false },
      { parametro: "Plaquetas",           valor: 215,   unidad: "10³/µL", refMin: 163,   refMax: 337,   anormal: false },
      { parametro: "VPM",                 valor: 10.40, unidad: "fL",     refMin: 9.40,  refMax: 12.40, anormal: false },
      { parametro: "Linfocitos %",        valor: 39.6,  unidad: "%",      refMin: 21.8,  refMax: 53.1,  anormal: false },
      { parametro: "Monocitos %",         valor: 11.0,  unidad: "%",      refMin: 5.3,   refMax: 12.2,  anormal: false },
      { parametro: "Eosinófilos %",       valor: 3.1,   unidad: "%",      refMin: 0.8,   refMax: 7.0,   anormal: false },
      { parametro: "Basófilos %",         valor: 0.5,   unidad: "%",      refMin: 0.2,   refMax: 1.2,   anormal: false },
      { parametro: "Neutrófilos %",       valor: 45.6,  unidad: "%",      refMin: 34.0,  refMax: 67.9,  anormal: false },
      { parametro: "Linfocitos abs",      valor: 3.24,  unidad: "10³/µL", refMin: 1.32,  refMax: 3.57,  anormal: false },
      { parametro: "Monocitos abs",       valor: 0.90,  unidad: "10³/µL", refMin: 0.30,  refMax: 0.82,  anormal: true,  direccion: "alta" },
      { parametro: "Eosinófilos abs",     valor: 0.25,  unidad: "10³/µL", refMin: 0.04,  refMax: 0.54,  anormal: false },
      { parametro: "Basófilos abs",       valor: 0.04,  unidad: "10³/µL", refMin: 0.01,  refMax: 0.08,  anormal: false },
      { parametro: "Neutrófilos abs",     valor: 3.73,  unidad: "10³/µL", refMin: 1.78,  refMax: 5.38,  anormal: false }
    ]
  },

  {
    fecha: "2026-02-25",
    tomada: "2026-02-25 06:02:37",
    analizada: "2026-02-25 11:21:14",
    laboratorio: null,
    notas: [
      "En frotis de sangre periférica se observan plaquetas disminuidas en cantidad por estimación, macroplaquetas en cantidad moderada",
      "No se observaron cúmulos plaquetarios",
      "Estudio verificado"
    ],
    resultados: [
      { parametro: "Leucocitos",          valor: 7.59,  unidad: "10³/µL", refMin: 4.23,  refMax: 9.07,  anormal: false },
      { parametro: "Eritrocitos",         valor: 5.33,  unidad: "10⁶/µL", refMin: 4.63,  refMax: 6.08,  anormal: false },
      { parametro: "Hemoglobina",         valor: 17.10, unidad: "g/dL",   refMin: 13.70, refMax: 17.50, anormal: false },
      { parametro: "Hematocrito",         valor: 50.40, unidad: "%",      refMin: 40.10, refMax: 51.00, anormal: false },
      { parametro: "VCM",                 valor: 94.60, unidad: "fL",     refMin: 79.00, refMax: 92.20, anormal: true,  direccion: "alta" },
      { parametro: "HCM",                 valor: 32.10, unidad: "pg",     refMin: 25.70, refMax: 32.20, anormal: false },
      { parametro: "CHCM",                valor: 33.9,  unidad: "g/dL",   refMin: 32.3,  refMax: 36.5,  anormal: false },
      { parametro: "ADE-DE",              valor: 47.1,  unidad: "fL",     refMin: 35.1,  refMax: 43.9,  anormal: true,  direccion: "alta" },
      { parametro: "ADE-CV",              valor: 13.4,  unidad: "%",      refMin: 11.6,  refMax: 14.4,  anormal: false },
      { parametro: "Plaquetas",           valor: 119,   unidad: "10³/µL", refMin: 163,   refMax: 337,   anormal: true,  direccion: "baja", nota: "Macroplaquetas moderadas en frotis" },
      { parametro: "VPM",                 valor: 13.00, unidad: "fL",     refMin: 9.40,  refMax: 12.40, anormal: true,  direccion: "alta" },
      { parametro: "Linfocitos %",        valor: 38.3,  unidad: "%",      refMin: 21.8,  refMax: 53.1,  anormal: false },
      { parametro: "Monocitos %",         valor: 8.7,   unidad: "%",      refMin: 5.3,   refMax: 12.2,  anormal: false },
      { parametro: "Eosinófilos %",       valor: 1.7,   unidad: "%",      refMin: 0.8,   refMax: 7.0,   anormal: false },
      { parametro: "Basófilos %",         valor: 0.5,   unidad: "%",      refMin: 0.2,   refMax: 1.2,   anormal: false },
      { parametro: "Neutrófilos %",       valor: 50.4,  unidad: "%",      refMin: 34.0,  refMax: 67.9,  anormal: false },
      { parametro: "Linfocitos abs",      valor: 2.91,  unidad: "10³/µL", refMin: 1.32,  refMax: 3.57,  anormal: false },
      { parametro: "Monocitos abs",       valor: 0.66,  unidad: "10³/µL", refMin: 0.30,  refMax: 0.82,  anormal: false },
      { parametro: "Eosinófilos abs",     valor: 0.13,  unidad: "10³/µL", refMin: 0.04,  refMax: 0.54,  anormal: false },
      { parametro: "Basófilos abs",       valor: 0.04,  unidad: "10³/µL", refMin: 0.01,  refMax: 0.08,  anormal: false },
      { parametro: "Neutrófilos abs",     valor: 3.82,  unidad: "10³/µL", refMin: 1.78,  refMax: 5.38,  anormal: false }
    ]
  },

  {
    fecha: "2026-04-15",
    tomada: "2026-04-15 06:52:57",
    analizada: null,
    laboratorio: "Unidad de Patología",
    notas: [],
    resultados: [
      { parametro: "Eritrocitos",             valor: 5.28,  unidad: "10⁶/µL", refMin: 4.30,  refMax: 5.90,  anormal: false },
      { parametro: "Hemoglobina",             valor: 16.8,  unidad: "g/dL",   refMin: 13.7,  refMax: 17.0,  anormal: false },
      { parametro: "Hematocrito",             valor: 49.2,  unidad: "%",      refMin: 40.0,  refMax: 52.0,  anormal: false },
      { parametro: "VGM",                     valor: 93.2,  unidad: "fL",     refMin: 84.0,  refMax: 97.0,  anormal: false },
      { parametro: "HCM",                     valor: 31.8,  unidad: "pg",     refMin: 26.0,  refMax: 36.0,  anormal: false },
      { parametro: "CHCM",                    valor: 34.1,  unidad: "g/dL",   refMin: 30.0,  refMax: 35.0,  anormal: false },
      { parametro: "ADE-SD",                  valor: 44.2,  unidad: "fL",     refMin: 35.0,  refMax: 56.0,  anormal: false },
      { parametro: "ADE-CV",                  valor: 13.0,  unidad: "%",      refMin: 11.60, refMax: 14.30, anormal: false },
      { parametro: "Leucocitos",              valor: 8.53,  unidad: "10³/µL", refMin: 3.90,  refMax: 9.50,  anormal: false },
      { parametro: "Linfocitos %",            valor: 39.7,  unidad: "%",      refMin: 20.0,  refMax: 35.0,  anormal: true,  direccion: "alta" },
      { parametro: "Linfocitos abs",          valor: 3.39,  unidad: "10³/µL", refMin: 1.30,  refMax: 3.40,  anormal: false, nota: "Límite superior" },
      { parametro: "Monocitos %",             valor: 6.6,   unidad: "%",      refMin: 5.1,   refMax: 11.1,  anormal: false },
      { parametro: "Monocitos abs",           valor: 0.56,  unidad: "10³/µL", refMin: 0.31,  refMax: 0.92,  anormal: false },
      { parametro: "Eosinófilos %",           valor: 1.6,   unidad: "%",      refMin: 0.4,   refMax: 6.6,   anormal: false },
      { parametro: "Eosinófilos abs",         valor: 0.14,  unidad: "10³/µL", refMin: 0.03,  refMax: 0.39,  anormal: false },
      { parametro: "Basófilos %",             valor: 0.5,   unidad: "%",      refMin: 0.2,   refMax: 1.3,   anormal: false },
      { parametro: "Basófilos abs",           valor: 0.04,  unidad: "10³/µL", refMin: 0.01,  refMax: 0.10,  anormal: false },
      { parametro: "Neutrófilos %",           valor: 52.1,  unidad: "%",      refMin: 40.0,  refMax: 75.0,  anormal: false },
      { parametro: "Neutrófilos totales",     valor: 4.45,  unidad: "10³/µL", refMin: 1.50,  refMax: 5.70,  anormal: false },
      { parametro: "Plaquetas",               valor: 144,   unidad: "10³/µL", refMin: 149,   refMax: 368,   anormal: true,  direccion: "baja" },
      { parametro: "LDH",                     valor: 173,   unidad: "U/L",    refMin: 135,   refMax: 225,   anormal: false },
      { parametro: "Glucosa",                 valor: 92,    unidad: "mg/dL",  refMin: 70,    refMax: 100,   anormal: false },
      { parametro: "BUN",                     valor: 23.36, unidad: "mg/dL",  refMin: 6.00,  refMax: 20.00, anormal: true,  direccion: "alta" }
    ]
  }
];
