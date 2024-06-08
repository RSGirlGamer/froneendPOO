$(document).ready(function() {
  $('#formularioConfigurarPrestamosA').submit(function (e) {
    e.preventDefault();
    var configuration = {
      id: 2,
      type_user: "student",
      amount: $("#borrowStudent").val()
    }
    var saveBorrowRequest = $.ajax({
      method: "PUT",
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      url: "http://localhost:8080/borrowConfigurations/borrowConfiguration/update",
      data: JSON.stringify(configuration)
    });
    saveBorrowRequest.done(function (data) {
      Swal.fire({
          title: "Se ha guardado la configuración correctamente",
          icon: "success",
        });
    })
    saveBorrowRequest.fail(function (data) {
      Swal.fire({
          title: "Hubo un problema",
          icon: "error",
        });
    })
  })
  $('#formularioConfigurarPrestamosP').submit(function (e) {
    e.preventDefault();
    var configuration = {
      id: 1,
      type_user: "prof",
      amount: $("#borrowMaster").val()
    }
    var saveBorrowRequest = $.ajax({
      method: "PUT",
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      url: "http://localhost:8080/borrowConfigurations/borrowConfiguration/update",
      data: JSON.stringify(configuration)
    });
    saveBorrowRequest.done(function (data) {
      Swal.fire({
          title: "Se ha guardado la configuración correctamente",
          icon: "success",
        });
    })
    saveBorrowRequest.fail(function (data) {
      Swal.fire({
          title: "Hubo un problema",
          icon: "error",
        });
    })
  })
});