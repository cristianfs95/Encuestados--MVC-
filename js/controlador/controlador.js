/*** Controlador ***/
var Controlador = function(modelo) {
    this.modelo = modelo;
};

Controlador.prototype = {
    agregarPregunta: function(pregunta, respuestas) {
        this.modelo.agregarPregunta(pregunta, respuestas);
    },

    borrarPregunta: function(id) {
        this.modelo.borrarPregunta(id);
    },

    borrarTodasLasPreguntas: function() {
        this.modelo.borrarTodasLasPreguntas();
    },

    modificarPregunta: function(id, esPregunta, input) {
        this.modelo.editarPregunta(id, esPregunta, input);
    },

    agregarVoto: function(pregunta, respuestaSeleccionada) {
        this.modelo.agregarVoto(pregunta, respuestaSeleccionada);
    },
};

