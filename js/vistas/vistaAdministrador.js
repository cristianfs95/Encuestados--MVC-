/*** Vista administrador ***/
var VistaAdministrador = function(modelo, controlador, elementos) {
    this.modelo = modelo;
    this.controlador = controlador;
    this.elementos = elementos;
    var contexto = this;

    // suscripción de observadores
    this.modelo.preguntaAgregar.suscribir(function() {
        contexto.reconstruirLista();
    });
    this.modelo.preguntaBorrar.suscribir(function() {
        contexto.reconstruirLista();
    });
    this.modelo.preguntaBorrarTodo.suscribir(function() {
        contexto.reconstruirLista();
    });
    this.modelo.preguntaEditar.suscribir(function() {
        contexto.reconstruirLista();
    });
};


VistaAdministrador.prototype = {
    //lista
    inicializar: function() {
        //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
        this.reconstruirLista();
        this.configuracionDeBotones();
        validacionDeFormulario();
    },

    construirElementoPregunta: function(pregunta) {
        var contexto = this;
        var nuevoItem;
        nuevoItem = $('<li>', {
            'class': 'list-group-item',
            'id'   : pregunta.id,
            'text' : pregunta.textoPregunta

        });
        var interiorItem = $('.d-flex');
        var titulo = interiorItem.find('h5');
        titulo.text(pregunta.textoPregunta);
        interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp) {
            return " " + resp.textoRespuesta;
        }));
        nuevoItem.html($('.d-flex').html());
        return nuevoItem;
    },

    reconstruirLista: function() {
        var lista = this.elementos.lista;
        lista.html('');
        var preguntas = this.modelo.preguntas;
        for (var i=0;i<preguntas.length;++i){
            lista.append(this.construirElementoPregunta(preguntas[i]));
        }
    },

    configuracionDeBotones: function() {
        var e = this.elementos;
        var contexto = this;

        //asociacion de eventos a boton
        e.botonAgregarPregunta.click(function() {
            var value = e.pregunta.val();
            var respuestas = [];
            var inputCargado = false;
            $('[name="option[]"]').each(function() {
                //completar
                var respuesta = $(this).val();
                if (respuesta.length > 0) {
                    respuestas.push({
                        'textoRespuesta': respuesta,
                        'cantidad': 0
                    });
                    inputCargado = true;
                }
            })
            contexto.limpiarFormulario();
            //Control de pregunta vacia
            inputCargado? contexto.controlador.agregarPregunta(value, respuestas) : swal({
                title: "",
                text: "No hay ninguna pregunta seleccionada.",
                icon: "error",
                dangerMode: true,
            })
            inputCargado = false;
        });
        //asociar el resto de los botones a eventos
        e.botonBorrarPregunta.click(function() {
            const preguntaActiva = e.lista.find(".active");

            if (preguntaActiva.length === 0) {
                swal({
                    title: "Eliminar",
                    text: "No hay ninguna pregunta seleccionada.",
                    icon: "error",
                    dangerMode: true,
                })
                return false;
            }; //Control de selección vacio.

            var id = parseInt(e.lista.find(".active")[0].id);
            var pregunta = e.lista.find(".active").find("h5")[0].innerText;

            swal({
                title: "¿Esta seguro?",
                text: "¡Se va a eliminar la pregunta! (" + pregunta + ")",
                icon: "warning",
                buttons: true,
                dangerMode:  true,
            })
                .then((borrar) => {
                if (borrar) {
                    contexto.limpiarFormulario();
                    contexto.controlador.borrarPregunta(id);
                    swal({
                        text: "Tu pregunta fue eliminada con éxito.",
                        icon: "success",
                    });
                    return true;
                }
                else {
                    swal({
                        text: "No se ha borrado ninguna pregunta.",
                        icon: "error",
                    });
                }
            });
        });

        e.borrarTodo.click(function() {
            swal({
                title: "¿Esta seguro?",
                text: "¡Se va a eliminar TODAS las preguntas!",
                icon: "warning",
                buttons: true,
                dangerMode:  true,
            })
                .then((borrar) => {
                if (borrar) {
                    contexto.limpiarFormulario();
                    contexto.controlador.borrarTodasLasPreguntas();
                    swal({
                        text: "Tu preguntas fueron eliminadas con éxito.",
                        icon: "success",
                    });
                    return true;
                }
                else {
                    swal({
                        text: "No se ha borrado ninguna pregunta.",
                        icon: "error",
                    });
                }
            });

        });
        e.botonEditarPregunta.click(function() {
            const preguntaActiva = e.lista.find(".active");

            if (preguntaActiva.length === 0) {
                swal({
                    title: "Editar",
                    text: "No hay ninguna pregunta seleccionada.",
                    icon: "error",
                    dangerMode: true,
                })
                return false;
            }; //Control de selección vacio.

            const id = parseInt(e.lista.find(".active")[0].id);
            const pregunta = e.lista.find(".active").find("h5")[0].innerText;

            swal({
                title: "Editar",
                text: "¿Quieres editar la PREGUNTA o la RESPUESTA?",
                icon: "warning",
                buttons: {
                    cancel: "Cancelar",
                    pregunta: true,
                    respuesta: true,
                },
            })
                .then((value) => {
                switch (value) {

                    case "pregunta":
                        swal({
                            title: "",
                            text: "Ingrese la nueva pregunta:",
                            content: "input",
                        })
                            .then((input) => {
                            if(!input) {
                                swal("","Se ha ingresado el campo vacio.", "error");
                                return false;
                            }
                            contexto.controlador.modificarPregunta(id,true,input)
                            swal("","Se ha editado la pregunta.", "success")
                        });
                        break;

                    case "respuesta":
                        swal({
                            title: "Ingrese la nueva respuesta",
                            text: "si es más de una separarlas con coma ej.: Rojo,Verde,Negro (sin espacios).",
                            content: "input",
                        })
                            .then((input) => {
                            if(!input) {
                                swal("","Se ha ingresado el campo vacio.", "error");
                                return false;
                            }
                            contexto.controlador.modificarPregunta(id,false,input)
                            swal("","Se ha editado la respuesta.", "success");
                        });
                        break;

                    default:
                        swal("","No se ha editado ninguna pregunta.", "error");
                }
            });
        });
    },
    limpiarFormulario: function(){
        $('.form-group.answer.has-feedback.has-success').remove();
    },
};
