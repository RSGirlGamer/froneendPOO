// loadNavbar.js
function loadMenu() {
  // Obtener el objeto del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Cargar el HTML y CSS del menú
  fetch("../src/components/menu.html")
    .then((response) => response.text())
    .then((data) => {
      const menuContainer = document.createElement("div");
      menuContainer.classList.add("menu");

      menuContainer.innerHTML = data;

      // Verificar si el usuario es administrador
      if (user && user.user_type === "admin") {
        // Si es administrador, crear la opción de Encargados
        const ul = menuContainer.querySelector("ul");
        const encargadosItem = document.createElement("li");
        encargadosItem.innerHTML =
          '<a href="encargados.html">Módulo de Encargados</a>';
        ul.insertBefore(encargadosItem, ul.firstChild);
      }

      // Seleccionar el contenedor
      const container = document.querySelector(".container");

      // Insertar el nuevo div como el primer hijo del contenedor
      container.insertBefore(menuContainer, container.lastChild);
    })
    .catch((error) => console.error("Error loading menu:", error));

  // Cargar el CSS del navbar
  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = "../css/sidebar.css";
  document.head.appendChild(linkElement);
}

// Llamar a la función para cargar el navbar
loadMenu();
