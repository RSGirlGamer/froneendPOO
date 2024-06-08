// Función para cargar facultades desde el servidor
function cargarFacultades() {
  fetch("http://localhost:8080/faculties")
    .then((response) => response.json())
    .then((data) => {
      const selectFacultad = document.getElementById("facultad_id");
      const facultad2 = document.getElementById("facultad2");
      data.forEach((facultad) => {
        const option = document.createElement("option");
        option.value = facultad.facultad_id;
        option.textContent = facultad.facultad_name;
        selectFacultad.appendChild(option);
      });
      data.forEach((facultad) => {
        const option = document.createElement("option");
        option.value = facultad.facultad_id;
        option.textContent = facultad.facultad_name;
        facultad2.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar facultades:", error));
}

// Función para cargar carreras desde el servidor
function cargarCarreras() {
  fetch("http://localhost:8080/majors")
    .then((response) => response.json())
    .then((data) => {
      const selectCarrera = document.getElementById("carreras");
      data.forEach((facultad) => {
        const option = document.createElement("option");
        option.value = facultad.carrera_id;
        option.textContent = facultad.carrera_name;
        selectCarrera.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar facultades:", error));
}

// Función para cargar carreras cursos el servidor
function cargarCursos() {
  fetch("http://localhost:8080/categories")
    .then((response) => response.json())
    .then((data) => {
      const selectCurso = document.getElementById("curso");
      data.forEach((facultad) => {
        const option = document.createElement("option");
        option.value = facultad.curso_id;
        option.textContent = facultad.curso_name;
        selectCurso.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar facultades:", error));
}

// Llamar a la función para cargar dropdowns cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarFacultades);
document.addEventListener("DOMContentLoaded", cargarCarreras);
document.addEventListener("DOMContentLoaded", cargarCursos);

///////////////////////////////////////////////////////////////////////////
// Función para ingresar usuarios y asignar privilegios
document
  .getElementById("formularioCrearUsuarios")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const email = formData.get("email");

    // Crear objeto para almacenar los datos del usuario
    const userData = {
      username: formData.get("username"),
      user_type: formData.get("user_type"),
      password: formData.get("password"),
    };

    // Obtener todos los usuarios para verificar si el nombre de usuario ya existe
    fetch("http://localhost:8080/users")
      .then((response) => response.json())
      .then((users) => {
        // Verificar si el nombre de usuario ya existe en la lista de usuarios
        const usernameExists = users.some((user) => user.username === username);
        if (usernameExists) {
          // Si el nombre de usuario ya existe, mostrar un mensaje de error
          swal.fire({
            title: "Error",
            text: "El nombre de usuario ya está en uso",
            icon: "error",
          });
        } else {
          // Obtener todos los detalles de usuario para verificar si el correo electrónico ya existe
          fetch("http://localhost:8080/userdetails")
            .then((response) => response.json())
            .then((userDetails) => {
              // Verificar si el correo electrónico ya existe en la lista de detalles de usuario
              const emailExists = userDetails.some(
                (userDetail) => userDetail.email === email
              );
              if (emailExists) {
                // Si el correo electrónico ya existe, mostrar un mensaje de error
                swal.fire({
                  title: "Error",
                  text: "El correo electrónico ya está en uso",
                  icon: "error",
                });
              } else {
                // Si el nombre de usuario y el correo electrónico no existen, enviar los datos a la API para crear el usuario
                fetch("http://localhost:8080/users/user/save", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(userData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    const user_id = data.user_id;

                    const userDetailsData = {
                      name: formData.get("name"),
                      last_name: formData.get("last_name"),
                      facultad_id: {
                        facultad_id: parseInt(formData.get("facultad_id"), 10),
                        facultad_name: document.querySelector(
                          `#facultad_id option[value="${formData.get(
                            "facultad_id"
                          )}"]`
                        ).textContent,
                      },
                      email: formData.get("email"),
                      user_id: {
                        user_id: user_id,
                        username: userData.username,
                        user_type: userData.user_type,
                        password: userData.password,
                      },
                    };

                    // Enviar los detalles del usuario a la API para crearlos
                    return fetch(
                      "http://localhost:8080/userdetails/userdetail/save",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(userDetailsData),
                      }
                    );
                  })
                  .then((response) => response.json())
                  .then((data) => {
                    // Mostrar mensaje de éxito
                    swal.fire({
                      title: "Éxito",
                      text: "Usuario creado exitosamente",
                      icon: "success",
                    });
                    // Limpiar el formulario
                    event.target.reset();
                  })
                  .catch((error) =>
                    console.error("Error al crear usuario:", error)
                  );
              }
            })
            .catch((error) =>
              console.error(
                "Error al obtener la lista de detalles de usuario:",
                error
              )
            );
        }
      })
      .catch((error) =>
        console.error("Error al obtener la lista de usuarios:", error)
      );
  });

////////////////////////////////////////////////////////////////////////////
// Función para restablecer contraseña de usuarios
const formIdSearch = document.getElementById("searchUserForm");

formIdSearch.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchUsername = document.getElementById("searchUsername").value;
  const normalizedUsername = normalizeString(searchUsername);

  // Enviar solicitud de búsqueda
  fetch("http://localhost:8080/userdetails")
    .then((response) => response.json())
    .then((data) => {
      const userSelect = document.getElementById("userSelect");
      userSelect.innerHTML = "";

      // Filtrar los usuarios que coincidan con el nombre de usuario buscado
      const filteredUsers = data.filter((detail) => {
        const normalizedDetailUsername = normalizeString(
          detail.user_id.username
        );
        const normalizedDetailName = normalizeString(detail.name);
        const normalizedDetailLastName = normalizeString(detail.last_name);
        return (
          normalizedDetailUsername.includes(normalizedUsername) ||
          normalizedDetailName.includes(normalizedUsername) ||
          normalizedDetailLastName.includes(normalizedUsername)
        );
      });

      if (filteredUsers.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontraron usuarios.",
        });
        return;
      }

      // Llenar el select con los resultados de la búsqueda
      filteredUsers.forEach((detail) => {
        const user = detail.user_id;
        const option = document.createElement("option");
        option.value = user.user_id;
        option.text = `${detail.name} ${detail.last_name} (${user.username})`;
        userSelect.appendChild(option);
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al buscar usuarios.",
      });
      console.error(error);
    });
});

// Maneja el evento de cambio en el select de usuarios
document.getElementById("userSelect").addEventListener("change", function () {
  const userSelect = document.getElementById("userSelect");
  const selectedUserId = Number(userSelect.value);

  if (selectedUserId) {
    // Obtener los detalles del usuario seleccionado
    fetch("http://localhost:8080/userdetails")
      .then((response) => response.json())
      .then((data) => {
        const selectedUser = data.find(
          (user) => user.user_id.user_id === selectedUserId
        );
        if (selectedUser) {
          const currentPasswordFromServer = selectedUser.user_id.password;
          document.getElementById("currentPassword").value =
            currentPasswordFromServer;
          document.getElementById("resetPasswordForm").dataset.userId =
            selectedUserId;
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró el usuario seleccionado.",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al obtener los detalles del usuario.",
        });
        console.error(error);
      });
  }
});

const formIdContrasenia = document.getElementById("resetPasswordForm");

formIdContrasenia.addEventListener("submit", function (event) {
  event.preventDefault();

  const userId = event.target.dataset.userId;
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  if (currentPassword === newPassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "La nueva contraseña no puede ser igual a la actual.",
    });
    return;
  } else {
    const userSelect = document.getElementById("userSelect");

    if (
      isNaN(Number(userId)) ||
      userSelect.options.length === 0 ||
      document.getElementById("currentPassword").value === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes realizar una busqueda y seleccionar el usuario al que deseas cambiar la contraseña.",
      });

      formIdContrasenia.reset();
      return;
    }

    console.log(Number(userId), newPassword, formIdContrasenia);
    updatePassword(Number(userId), newPassword, formIdContrasenia);
  }
});

function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Función para actualizar la contraseña del usuario
function updatePassword(userId, newPassword, formIdContrasenia) {
  // Obtener el array completo desde el endpoint "/users"
  return fetch("http://localhost:8080/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los usuarios.");
      }
      return response.json();
    })
    .then((users) => {
      // Encontrar el usuario correcto en el array
      const userIndex = users.findIndex((user) => user.user_id === userId);

      if (userIndex === -1) {
        throw new Error("Usuario no encontrado.");
      }

      // Obtener el usuario necesario
      const user = users[userIndex];

      // Actualizar solo el campo de password del usuario
      const updatedUser = { ...user, password: newPassword };

      // Enviar el usuario actualizado de vuelta al servidor;
      return fetch(`http://localhost:8080/users/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error al actualizar la contraseña.");
      }
      return response.json();
    })
    .then((data) => {
      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada correctamente",
        showConfirmButton: false,
        timer: 1500,
      });

      // Limpiar los campos de buscar
      formIdSearch.reset();

      // Obtener el elemento select
      document.getElementById("userSelect").innerHTML = "";

      // Obtener el formulario y resetearlo
      formIdContrasenia.reset();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

/////////////////////////////// NUEVOS EJEMPLARES ///////////////////////////////
const formularioCrearEjemplares = document.getElementById(
  "formularioCrearEjemplares"
);

//Guardar los valores del formulario
let ejemplarTitleValue = "";
let tipoEjemplar = "";
let authorValue = "";
let facultadValue = "";
let carrera = "";
let curso = "";
let publicationDate = "";
let editorial = "";
let stockValue = "";
let ubicacionFisica = "";
let pagesNumber = "";
let ISBNValue = "";

document.addEventListener("DOMContentLoaded", (event) => {
  const selectElement = document.getElementById("tipo");
  selectElement.selectedIndex = 1;

  //Entrada título de ejemplar
  const campoEjemplarValue = document.getElementById("ejemplarTitle");
  campoEjemplarValue.addEventListener("change", function () {
    ejemplarTitleValue = this.value;
  });

  //Entrada tipo de ejemplar
  const campoTipoEjemplar = document.getElementById("tipo");
  campoTipoEjemplar.addEventListener("change", function () {
    tipoEjemplar = this.value;
    console.log(tipoEjemplar);

    //Ocultar campos de formulario
    const divTitle = document.getElementById("divTitle");
    const divEjemplar = document.getElementById("divEjemplar");
    const divAutor = document.getElementById("divAutor");
    const divFacultad = document.getElementById("divFacultad");
    const divCarrera = document.getElementById("divCarrera");
    const divCurso = document.getElementById("divCurso");
    const divPublicationDate = document.getElementById("divPublicationDate");
    const divEditorial = document.getElementById("divEditorial");
    const divStock = document.getElementById("divStock");
    const divUbicacionFisica = document.getElementById("divUbicacionFisica");
    const divPages = document.getElementById("divPages");
    const divISBN = document.getElementById("divISBN");

    if (tipoEjemplar === "obra") {
      divEjemplar;
      divAutor;
      divFacultad;
    } else if (campoTipoEjemplar.value === "cd") {
      divAutor.classList.remove("hide");
      divFacultad.classList.remove("hide");
    }
  });

  //Entrada en el campo de autor
  const campoAuthorValue = document.getElementById("author");
  campoAuthorValue.addEventListener("input", function () {
    authorValue = this.value;
  });

  //Entrada en el campo facultad
  const campoFacultadValue = document.getElementById("facultad2");
  campoFacultadValue.addEventListener("change", function () {
    facultadValue = this.value;
  });

  //Entrada en el campo carreras
  const campoCarrera = document.getElementById("carreras");
  campoCarrera.addEventListener("change", function () {
    carrera = this.value;
  });

  //Entrada en el campo curso
  const campoCurso = document.getElementById("curso");
  campoCurso.addEventListener("change", function () {
    curso = this.value;
  });

  //Entrada en el campo fecha de publicación
  const campoPublicationDate = document.getElementById("publication_date");
  campoPublicationDate.addEventListener("change", function () {
    publicationDate = this.value;
  });

  //Entrada en el campo de editorial
  const campoEditorial = document.getElementById("editorial");
  campoEditorial.addEventListener("input", function () {
    editorial = this.value;
  });

  // Entrada en el campo de cantidad disponible
  const campoStockValue = document.getElementById("stock");
  campoStockValue.addEventListener("input", function () {
    stockValue = this.value;
  });

  //Entrada en el campo de ubicación física
  const campoUbicacionFisica = document.getElementById("ubication");
  campoUbicacionFisica.addEventListener("input", function () {
    ubicacionFisica = this.value;
  });

  // Entrada en el campo de número de páginas
  const campoPagesNumber = document.getElementById("pages");
  campoPagesNumber.addEventListener("input", function () {
    pagesNumber = this.value;
  });

  // Entrada en el campo de ISBN
  const campoISBNValue = document.getElementById("isbn");
  campoISBNValue.addEventListener("input", function () {
    ISBNValue = this.value;
  });
});

formularioCrearEjemplares.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log("tipoEjemplar", tipoEjemplar);

  // Crear objeto del autor
  const autor = {
    autor: authorValue,
  };

  // Crear objeto con los valores del formulario
  const ejemplar = {
    titulo: ejemplarTitleValue,
    id_autor: {
      id_autor: authorValue, // Suponiendo que authorValue es el ID del autor
    },
    tipo: tipoEjemplar,
    curso_id: {
      curso_id: curso, // Suponiendo que curso es el ID del curso
      carrera_id: {
        carrera_id: carrera, // Suponiendo que carrera es el ID de la carrera
        facultad_id: {
          facultad_id: facultadValue, // Suponiendo que facultad es el ID de la facultad
        },
      },
    },
    fecha_publicacion: publicationDate,
    editorial: editorial,
    stock: stockValue,
    location: ubicacionFisica,
    numero_paginas: pagesNumber,
    isbn: ISBNValue,
  };

  // Enviar los datos del autor a la API
  fetch("http://localhost:8080/authors/author/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(autor),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Realizar la segunda solicitud fetch dentro del bloque then de la primera
      fetch("http://localhost:8080/authors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const ultimoElemento = data[data.length - 1];
          authorValue = ultimoElemento.id_autor;

          fetch("http://localhost:8080/books/book/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ejemplar),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Ejemplar guardado con éxito:", data);
            })
            .catch((error) => {
              console.error("Error al guardar el ejemplar:", error);
            });
        })
        .catch((error) => {
          console.error("Hubo un problema con la solicitud fetch:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log("Ejemplar", ejemplar);
});
