// Función para cargar facultades desde el servidor
function cargarFacultades() {
  fetch("http://localhost:8080/faculties")
    .then((response) => response.json())
    .then((data) => {
      const selectFacultad = document.getElementById("facultad_id");
      data.forEach((facultad) => {
        const option = document.createElement("option");
        option.value = facultad.facultad_id;
        option.textContent = facultad.facultad_name;
        selectFacultad.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar facultades:", error));
}

///////////////////////////////////////////////////////////////////////////
// Llamar a la función para cargar las facultades cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarFacultades);

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
