document.getElementById("loginForm").addEventListener("submit", submitLogin);

function submitLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Cargamos los datos del backend
  fetch("http://localhost:8080/users")
    .then((response) => response.json())
    .then((users) => {
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        redirectToModule(user);
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch((error) => {
      console.error("Error al obtener los usuarios:", error);
      alert(
        "Hubo un problema al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde."
      );
    });
}

//Redireccionamos dependiendo qué tipo de usuario es
function redirectToModule(user) {
  switch (user.user_type) {
    case "admin":
      window.location.href = "admin.html";
      break;
    case "prof":
      window.location.href = "prof.html";
      break;
    case "student":
      window.location.href = "student.html";
      break;
    default:
      alert("Tipo de usuario no reconocido");
  }
}
