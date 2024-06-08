$(document).ready(function() {
    var mora = {}
    $("#materialSelect").select2({
      allowClear: true
    })
    $("#userSelect").select2({
      allowClear: true,
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
    $("#userSelect").change(function (e) {
      mora = {}
      $('#materialSelect').val(null).trigger("change")
      $("#materialSelect").prop('disabled', false);
      $("#materialSelect").select2({
        ajax: {
          url: function (params) {
            return "http://localhost:8080/borrows";
          },
          dataType: "json",
          processResults: function (data, params) {
            var list = [];
            data.forEach((i) => {
              if(i.user_id.user_id == $("#userSelect").val() && i.estado != "devuelto") {
                if (params.term != undefined) {
                  if(params.term != '') {
                    if (i.id_material.titulo.startsWith(params.term)) {
                      list.push(i);
                    }
                  }
                } else {
                  list.push(i);
                }
              }
            });

            return {
              results: $.map(list, function (obj) {
                return { id: obj.id_prestamo, text: obj.id_material.titulo };
              }),
            };
          },
        },
      });
    })
    $("#materialSelect").change(function (e) {
      mora = {}
      var getMoraRequest = $.ajax({
        method: "GET",
        url: "http://localhost:8080/moras"
      });
      getMoraRequest.done(function (data) {
        data.forEach(e => {
          if(e.id_prestamo.id_prestamo == $("#materialSelect").val()) {
            mora = e;
          }
        })
        if(mora.mora > 0) {
          $("#moraLabel").text("La mora a pagar es de: $" + mora.mora);
        } else {
          $("#moraLabel").text("");
        }
      })
    })


    $('#formularioDevolucion').submit(function (e) {
      e.preventDefault();
      var borrow = {}
      var getBorrowRequest = $.ajax({
        method: "GET",
        url: "http://localhost:8080/borrows"
      });
      getBorrowRequest.done(function (data) {
        data.forEach(e => {
          if(e.id_prestamo == $("#materialSelect").val()) {
            borrow = e;
          }
        })
        borrow.estado = "devuelto"
        var saveBorrowRequest = $.ajax({
          method: "PUT",
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          url: "http://localhost:8080/borrows/borrow/update",
          data: JSON.stringify(borrow)
        });
        saveBorrowRequest.done(function (data) {
          if(mora != undefined) {
            mora.estado = "pagado"
            var saveMoraRequest = $.ajax({
              method: "PUT",
              headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
              },
              url: "http://localhost:8080/moras/mora/update",
              data: JSON.stringify(mora)
            });
            saveMoraRequest.done(function (data) {
              $('#userSelect').val(null).trigger("change")
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
          } else {
            $('#userSelect').val(null).trigger("change")
            Swal.fire({
              title: "Se ha guardado la configuración correctamente",
              icon: "success",
            });
          }
        })
        saveBorrowRequest.fail(function (data) {
          Swal.fire({
            title: "Hubo un problema",
            icon: "error",
          });
        })
      })
    })
  });