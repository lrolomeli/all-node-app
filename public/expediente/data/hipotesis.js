const hipotesis = {
  principal: {
    nombre: "Síndrome de silla turca vacía secundaria con hipopituitarismo parcial",
    estado: "No confirmada ni descartada",
    descripcion: "Paciente con aracnoidocele selar grado II (hipófisis comprimida al 50%, RMN junio 2025) que presenta el cuadro clínico clásico de disfunción hipofisaria: fatiga severa, debilidad, mareos, pérdida de 6 kg, libido bajo, piel seca, T3 total bajo (0.63 ng/mL), y episodios hipoglucémicos repetidos entre mayo y diciembre 2025.",
    problemaCentral: "Este hallazgo fue evaluado exclusivamente por neurocirugía (\"sin hallazgos importantes\") y nunca fue estudiado endocrinológicamente con panel hipofisario completo. El endocrinólogo que evaluó al paciente en enero 2026 enfocó la consulta en la prediabetes. El cuadro clínico del paciente permanece sin explicación causal."
  },

  correlacionesClinicas: [
    {
      peso: "alto",
      hallazgo: "T3 total bajo (0.63) con TSH normal (2.97)",
      interpretacion: "Patrón de hipotiroidismo central: la hipófisis no secreta suficiente TSH para mantener T3/T4. No es hipotiroidismo primario."
    },
    {
      peso: "moderado",
      hallazgo: "Episodios hipoglucémicos repetidos en no-diabético sin hipoglucemiantes",
      interpretacion: "Cortisol basal 20.40 µg/dL (mayo 2025) en rango normal matutino; sin embargo, un cortisol basal normal no descarta insuficiencia suprarrenal central parcial. La prueba definitiva es la estimulación con ACTH. Insulina 3.58 µIU/mL (límite inferior) descarta hiperinsulinismo como causa de hipoglucemias."
    },
    {
      peso: "alto",
      hallazgo: "Pérdida de 6 kg en deportista de alto rendimiento con dieta de 2500 kcal",
      interpretacion: "Pérdida de masa muscular incompatible con el nivel de actividad. Compatible con déficit de GH o hipocortisolismo crónico."
    },
    {
      peso: "moderado",
      hallazgo: "Libido bajo sin disfunción eréctil",
      interpretacion: "Patrón de déficit gonadotrópico (LH/FSH bajas → testosterona baja). Testosterona no medida aún."
    },
    {
      peso: "moderado",
      hallazgo: "Piel seca persistente",
      interpretacion: "Déficit de GH o hipotiroidismo central."
    },
    {
      peso: "moderado",
      hallazgo: "Fatiga y debilidad a pesar de composición corporal óptima",
      interpretacion: "No explicable por desacondicionamiento físico. Típico de hipocortisolismo o déficit de GH."
    },
    {
      peso: "patron",
      hallazgo: "Síntomas fluctuantes durante 11 meses",
      interpretacion: "Compatible con insuficiencia hipofisaria parcial: la glándula funciona intermitentemente bajo distintos estados metabólicos y de estrés."
    }
  ]
};
