document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No tienes permisos para acceder a esta página");
    window.location.href = `login.html`;
  } else {
    let urlObj = new URL(window.location.href);
    let pathname = urlObj.pathname;

    parts = pathname.split("/");
    const userTypehref = parts[parts.length - 1].replace(".html", "");

    if (user.user_type !== userTypehref) {
      alert("No tienes permisos para acceder a esta página");
      window.location.href = `${user.user_type}.html`;
    } else {
      document.body.classList.remove("loading");
    }
  }
});
