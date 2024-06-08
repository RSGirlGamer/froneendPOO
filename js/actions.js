// encargados.js
function openTab(event, tabName, formId, formId2, select) {
  // Ocultar todos los contenidos de las pestañas
  const tabContents = document.getElementsByClassName("tabcontent");
  for (let content of tabContents) {
    content.style.display = "none";
  }

  // Desactivar todas las pestañas
  const tabLinks = document.getElementsByClassName("tablink");
  for (let link of tabLinks) {
    link.classList.remove("active");
  }

  // Mostrar el contenido de la pestaña seleccionada
  document.getElementById(tabName).style.display = "block";

  // Activar la pestaña seleccionada
  event.currentTarget.classList.add("active");

  // Limpiar el formulario al cambiar de pestaña
  clearForm(formId);

  if (formId2) {
    clearForm(formId2);
  }

  if (select) {
    document.getElementById(select).innerHTML = "";
  }
}

// Función para limpiar el formulario
function clearForm(formId) {
  // Obtener el formulario y resetearlo
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

// Mostrar la pestaña "Ingresar Usuarios y Asignar Privilegios" por defecto al cargar la página
document.getElementById("ingresarUsuarios").style.display = "block";
document.getElementsByClassName("tablink")[0].classList.add("active");
