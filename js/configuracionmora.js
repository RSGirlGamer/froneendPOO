$(document).ready(function() {
    $('#formularioCalcularMora').submit(function (e) {
      e.preventDefault();
      var configuration = {
        id: 1,
        mora: $("#moraInput").val()
      }
      var saveMoraRequest = $.ajax({
        method: "PUT",
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        url: "http://localhost:8080/moraConfigurations/moraConfiguration/update",
        data: JSON.stringify(configuration)
      });
      saveMoraRequest.done(function (data) {
        Swal.fire({
            title: "Se ha guardado la configuración correctamente",
            icon: "success",
          });
      })
      saveMoraRequest.fail(function (data) {
        Swal.fire({
            title: "Hubo un problema",
            icon: "error",
          });
      })
    })
  });