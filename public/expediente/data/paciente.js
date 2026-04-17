const paciente = {
  nombre: "Roberto Lomelí",
  sexo: "Masculino",
  fechaNacimiento: "1967-12-18",
  edad: 58,
  ubicacion: "Guadalajara, Jalisco, México",

  habitos: {
    tabaco: {
      activo: true,
      edadInicio: 23,
      cajetillasDiarias: 2,
      anosTabaquismo: 35
    },
    alcohol: {
      activo: false,
      cese: "2024",
      nota: "Exalcohólico"
    },
    ejercicio: {
      frecuencia: "diario",
      nivel: "alto rendimiento"
    },
    hidratacion: {
      litrosDiarios: 1,
      alerta: true,
      nota: "Insuficiente"
    }
  },

  nutricion: {
    kcalDiarias: 2500,
    dietaActual: "Equilibrada",
    dietaHistorial: "Deficiente previa — causaba acidez crónica"
  },

  antecedentesQuirurgicos: [
    "Úlcera gástrica (resuelta quirúrgicamente)"
  ],

  antecedentesPatologicos: [
    "Acidez crónica recurrente",
    "Estrés acumulado",
    "Prediabetes (diagnóstico abril 2025)"
  ],

  composicionCorporal: {
    fecha: "2025-06-11",
    pesoKg: 70,
    perdidaPesoDesdeInicio: -6,
    notaPeso: "Pérdida de 6 kg desde mayo 2025 siendo deportista activo",
    icc: 0.81,
    grasaPct: 12.8,
    grasaKg: 9.0,
    musculoPct: 45.2,
    musculoKg: 31.7,
    perimetrosCm: {
      torax: 96,
      pecho: 92,
      cintura: 75,
      abdomen: 78,
      brazoCont: 32.5,
      brazoRelaj: 27,
      antebrazo: 24,
      cadera: 93,
      muslo: 49.5,
      pantorrilla: 35.5
    },
    plieguesCutaneosMm: {
      subescapular: 8,
      suprailiaco: 8,
      supraespinal: 5,
      abdomen: 11,
      triceps: 7,
      biceps: 3,
      muslo: 7,
      pierna: 3,
      midaxilar: 6,
      pecho: 2
    }
  }
};
