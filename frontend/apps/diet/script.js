// Datos de la tabla de dieta
const dieta = [
    {
      comida: "Pre-Entreno",
      proteinas: 1,
      cereales: 1,
      leguminosas: 0,
      frutas: 2,
      verduras: 0,
      lacteos: 2,
      grasas: 0,
      azucar: 3,
    },
    {
      comida: "Desayuno",
      proteinas: 5,
      cereales: 3,
      leguminosas: 1,
      frutas: 2,
      verduras: 0,
      lacteos: 1,
      grasas: 1,
      azucar: 0,
    },
    {
      comida: "Comida",
      proteinas: 4,
      cereales: 3,
      leguminosas: 0,
      frutas: 0,
      verduras: 3,
      lacteos: 0,
      grasas: 3,
      azucar: 0,
    },
    {
      comida: "Cena",
      proteinas: 4,
      cereales: 3,
      leguminosas: 0,
      frutas: 2,
      verduras: 1,
      lacteos: 0,
      grasas: 0,
      azucar: 0,
    },
  ];
  
  // Función para generar la tabla
  function generarTabla() {
    const tbody = document.querySelector("#diet-table tbody");
  
    dieta.forEach((item, rowIndex) => {
      const row = document.createElement("tr");
  
      // Columna de Comida
      const comidaCell = document.createElement("td");
      comidaCell.textContent = item.comida;
      row.appendChild(comidaCell);
  
      // Columnas de Porciones con Checkboxes
      const columnas = [
        "proteinas",
        "cereales",
        "leguminosas",
        "frutas",
        "verduras",
        "lacteos",
        "grasas",
        "azucar",
      ];
  
      columnas.forEach((col, colIndex) => {
        const cell = document.createElement("td");
  
        // Contenedor para el valor y el checkbox
        const container = document.createElement("div");
        container.className = "d-flex justify-content-between align-items-center";
  
        // Valor de la porción
        const valor = document.createElement("span");
        valor.textContent = item[col];
        container.appendChild(valor);
  
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
  
        // Recuperar el estado guardado
        const savedState = localStorage.getItem(`check-${rowIndex}-${colIndex}`);
        if (savedState === "true") {
          checkbox.checked = true;
          cell.style.textDecoration = "line-through";
          cell.style.color = "#888";
        }
  
        // Guardar el estado al cambiar el checkbox
        checkbox.addEventListener("change", () => {
          localStorage.setItem(`check-${rowIndex}-${colIndex}`, checkbox.checked);
          cell.style.textDecoration = checkbox.checked ? "line-through" : "none";
          cell.style.color = checkbox.checked ? "#888" : "#000";
        });
  
        container.appendChild(checkbox);
        cell.appendChild(container);
        row.appendChild(cell);
      });
  
      tbody.appendChild(row);
    });
  }
  
  // Función para desmarcar todas las casillas
  function desmarcarTodas() {
    const checkboxes = document.querySelectorAll("#diet-table input[type='checkbox']");
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = false;
      const cell = checkbox.closest("td");
      cell.style.textDecoration = "none";
      cell.style.color = "#000";
    });
  
    // Limpiar el localStorage
    localStorage.clear();
  }
  
  // Llamar a la función para generar la tabla al cargar la página
  generarTabla();
  
  // Agregar evento al botón de desmarcar
  document.getElementById("reset-button").addEventListener("click", desmarcarTodas);
