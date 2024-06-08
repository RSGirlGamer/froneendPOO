$(document).ready(function () {
  $("#userSelect").select2({
    ajax: {
      url: function (params) {
        return "http://localhost:8080/users";
      },
      dataType: "json",
      processResults: function (data, params) {
        var list = [];
        data.forEach((e) => {
          if (params.term != undefined) {
            if (e.username.startsWith(params.term)) {
              list.push(e);
            }
          } else {
            list.push(e);
          }
        });

        return {
          results: $.map(list, function (obj) {
            return { id: obj.user_id, text: obj.username };
          }),
        };
      },
    },
  });
  $("#materialSelect").select2({
    ajax: {
      url: function (params) {
        return "http://localhost:8080/materials";
      },
      dataType: "json",
      processResults: function (data, params) {
        var list = [];
        data.forEach((e) => {
          if (params.term != undefined) {
            if (
              e.titulo.startsWith(params.term) ||
              e.id_autor.autor.startsWith(params.term)
            ) {
              list.push(e);
            }
          } else {
            list.push(e);
          }
        });

        return {
          results: $.map(list, function (obj) {
            return { id: obj.id_material, text: obj.titulo };
          }),
        };
      },
    },
  });
  $("#formularioRealizarPrestamo").submit(function (e) {
    e.preventDefault();
    var morarequest = $.ajax({
      method: "GET",
      url: "http://localhost:8080/moras",
    });
    morarequest.done(function (data) {
      var isMora = false;
      data.forEach((e) => {
        if (e.id_prestamo.user_id.user_id == $("#userSelect").val()) {
          isMora = true;
        }
      });
      if (!isMora) {
        var canBorrowRequest = $.ajax({
          method: "GET",
          url: "http://localhost:8080/borrows",
        });
        canBorrowRequest.done(function (dataBorrow) {
          var canBorrow = true;
          var materialsBorrowed = 0;
          var user = {};
          dataBorrow.forEach((e) => {
            if (e.user_id.user_id == $("#userSelect").val()) {
              var user = e.user_id;
              materialsBorrowed++;
            }
          });
          if (user.user_type == "prof" && materialsBorrowed > 6) {
            canBorrow = false;
          } else if (user.user_type == "student" && materialsBorrowd > 3) {
            canBorrow = false;
          }
          if (canBorrow) {
            var stockrequest = $.ajax({
              method: "GET",
              url: "http://localhost:8080/materials",
            });
            stockrequest.done(function (dataMaterial) {
              var isStock = false;
              dataMaterial.forEach((e) => {
                if (
                  e.stock != 0 &&
                  $("#materialSelect").val() == e.id_material
                ) {
                  isStock = true;
                }
              });
              if (isStock) {
                var fecha_prestamo = new Date(Date.now());
                var fecha_devolucion = new Date();
                fecha_devolucion.setDate(fecha_prestamo.getDate() + 8);
                var estado = "prestado";
                var prestamo = {
                  user_id: {
                    user_id: $("#userSelect").val(),
                  },
                  id_material: {
                    id_material: $("#materialSelect").val(),
                  },
                  fecha_prestamo: fecha_prestamo,
                  fecha_devolucion: fecha_devolucion,
                  estado: estado,
                };
                saveBorrowRequest = $.ajax({
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  url: "http://localhost:8080/borrows/borrow/save",
                  data: JSON.stringify(prestamo),
                });
                saveBorrowRequest.done(function (dataFinal) {
                  Swal.fire({
                    title: "Guardado exitoso",
                    icon: "success",
                  });
                });
              } else {
                Swal.fire({
                  title: "Hubo un problema",
                  text: "El material no está en stock, intente de nuevo cuando esté en existencia",
                  icon: "error",
                });
              }
            });
          } else {
            Swal.fire({
              title: "Hubo un problema",
              text: "El usuario ha sobrepasado el limite de materiales prestados, intente de nuevo cuando haya regresado los materiales",
              icon: "error",
            });
          }
        });
      } else {
        Swal.fire({
          title: "Hubo un problema",
          text: "El usuario tiene mora, no puede realizar préstamo",
          icon: "error",
        });
      }
    });
  });
});
