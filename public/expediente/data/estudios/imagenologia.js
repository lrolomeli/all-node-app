const imagenologia = [
  {
    estudio: "RM Cráneo Simple",
    fecha: "2025-06-28",
    tecnica: "Secuencias en fase simple con equipo de 1.5 Teslas, desde la base hasta el vértex del cráneo",
    motivoEstudio: "Mareo",
    hallazgos: [
      {
        descripcion: "Parénquima cerebral con adecuada diferenciación entre sustancia gris y blanca. Núcleos grises centrales, corona radiada y centros semiovales de morfología y señal normal. Sin evidencia de lesiones focales o difusas.",
        relevancia: "normal"
      },
      {
        descripcion: "Estructuras vasculares con calibre y trayecto normal.",
        relevancia: "normal"
      },
      {
        descripcion: "Sistema ventricular supra e infratentorial de disposición y calibre normal.",
        relevancia: "normal"
      },
      {
        descripcion: "Quiste aracnoideo retrocerebeloso izquierdo — diámetros: transverso 2.3 cm, anteroposterior 1.6 cm.",
        relevancia: "hallazgo"
      },
      {
        descripcion: "Aracnoidocele selar grado II — invaginación de la cisterna supraselar que comprime el 50% la hipófisis.",
        relevancia: "clave",
        nota: "Evaluado solo por neurocirugía. Conclusión: 'sin hallazgos importantes'. Sin derivación a endocrinología. Este hallazgo NUNCA fue estudiado con panel hipofisario completo."
      },
      {
        descripcion: "Asa vascular en ángulo pontocerebeloso derecho a nivel del complejo VII–VIII nervio craneal — clasificación Chavda Tipo 1.",
        relevancia: "hallazgo"
      },
      {
        descripcion: "Cavidad orbitaria, senos paranasales y estructuras óseas sin alteraciones.",
        relevancia: "normal"
      }
    ],
    conclusionDiagnostica: [
      "Quiste aracnoideo retrocerebeloso izquierdo",
      "Aracnoidocele selar grado II",
      "En ángulo pontocerebeloso derecho asa vascular Tipo 1 en clasificación Chavda"
    ],
    especialistaQueEvaluó: "Neurocirugía",
    derivacionEndocrinologia: false
  },

  {
    estudio: "Telerradiografía de Tórax PA",
    fecha: null,
    tecnica: "Teleradiografía de tórax proyección PA",
    motivoEstudio: null,
    hallazgos: [
      { descripcion: "Tráquea lateralizada a la derecha, calibre normal.", relevancia: "hallazgo" },
      { descripcion: "Hilios y vascularidad pulmonar con calibre y distribución normal.", relevancia: "normal" },
      { descripcion: "Corazón con morfología y situación normal, bordes bien definidos. ICT: 0.42.", relevancia: "normal" },
      { descripcion: "Aorta alta, elongada, principalmente en su porción descendente.", relevancia: "hallazgo" },
      { descripcion: "Mediastino de contornos definidos y calibre normal.", relevancia: "normal" },
      { descripcion: "Pulmones en adecuada inspiración, sin infiltrados o condensaciones.", relevancia: "normal" },
      { descripcion: "Estructuras óseas muestran disminución de la radiopacidad. Cambios de osteoartrosis dorsal.", relevancia: "hallazgo" },
      { descripcion: "Senos cardiofrénicos y costodiafragmáticos libres.", relevancia: "normal" }
    ],
    conclusionDiagnostica: [
      "Aortoesclerosis",
      "Disminución de la radiopacidad ósea",
      "Osteoartrosis dorsal"
    ],
    sugerencias: ["Correlación clínica integral"]
  }
];
