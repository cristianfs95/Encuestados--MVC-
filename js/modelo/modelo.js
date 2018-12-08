/*** Modelo ***/
var Modelo = function() {
    this.preguntas = [];
    this.ultimoId = 0;
    this.recuperar();

    //inicializacion de eventos
    this.preguntaAgregar    = new Evento(this);
    this.preguntaBorrar     = new Evento(this);
    this.preguntaBorrarTodo = new Evento(this);
    this.preguntaEditar     = new Evento(this);
    this.preguntaVotar      = new Evento(this);
};

Modelo.prototype = {
    //Se obtiene el id más grande asignado a una pregunta.
    obtenerUltimoId: function() {
        return this.ultimoId;
    },

    //Se agrega una pregunta dado un nombre y sus respuestas.
    agregarPregunta: function(nombre, respuestas) {
        this.ultimoId = this.obtenerUltimoId() + 1;
        var nuevaPregunta = {'textoPregunta': nombre, 'id': this.ultimoId, 'cantidadPorRespuesta': respuestas};
        this.preguntas.push(nuevaPregunta);
        this.guardar();
        this.preguntaAgregar.notificar();
    },

    //Borrar pregunta por ID.
    borrarPregunta: function(id) {
        this.preguntas = this.preguntas.filter(pregunta => pregunta.id != id);
        this.guardar();
        this.preguntaBorrar.notificar();
    },

    //Borrar todas las preguntas.
    borrarTodasLasPreguntas: function() {
        this.preguntas = [];
        this.ultimoId = 0;
        this.guardar();
        this.preguntaBorrarTodo.notificar();
    },

    //Se edita la pregunta
    editarPregunta: function(id,esPregunta,input) {
        var preguntaAReemplazar = this.obtenerPregunta(id);
        if(esPregunta) { //Se edita LA PREGUNTA
            preguntaAReemplazar.textoPregunta = input;
            this.preguntas.splice(this.preguntas.indexOf(this.obtenerPregunta(id)), 1, preguntaAReemplazar);
            this.guardar();
            this.preguntaEditar.notificar();
        }
        else { //Se edita LA RESPUESTA
            input = input.split(",");
            var cantidadDePreguntasViejas = (this.obtenerPregunta(id).cantidadPorRespuesta.length);
            //Limpiamos..
            for(var i = 0; i < cantidadDePreguntasViejas; i++){
                preguntaAReemplazar.cantidadPorRespuesta.pop();
            }// para poder meterle las nuevas respuestas.
            for(var j = 0; j < input.length; j++){
                preguntaAReemplazar.cantidadPorRespuesta.push({
                    'textoRespuesta': input[j],
                    'cantidad': 0
                });
            }
            this.preguntas.splice(this.preguntas.indexOf(this.obtenerPregunta(id)), 1, preguntaAReemplazar);
            this.guardar();
            this.preguntaEditar.notificar();
        }
    },

    //Se busca pregunta en array
    obtenerPregunta: function(valor) {
        var identificador;
        if(typeof valor == 'number') {
            identificador = 'id';
        }
        else {
            identificador = 'textoPregunta'
        }
        for(var i=0;i<this.preguntas.length;++i){
            if(this.preguntas[i][identificador] === valor){
                return this.preguntas[i];
            }
        }
        return alert("La pregunta no está definida.");
    },

    //se agrega un voto
    agregarVoto: function(pregunta, respuesta) {
        for(var i=0; i < pregunta.cantidadPorRespuesta.length;++i){
            if (pregunta.cantidadPorRespuesta[i].textoRespuesta === respuesta) {
                var indicePregunta = -1;
                for(var j=0; j<this.preguntas.length; ++j){
                    if(this.preguntas[j].textoPregunta === pregunta.textoPregunta){
                        indicePregunta = j;
                    }
                }
                pregunta.cantidadPorRespuesta[i].cantidad += 1;
                this.preguntas.splice(indicePregunta, 1, pregunta);
            }
        }
        this.guardar();
        this.preguntaVotar.notificar();
    },

    //Se guardan las preguntas
    guardar: function(){
        localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
        localStorage.setItem('ultimoId',  JSON.stringify(this.ultimoId));
    },
    //Se recuperan las preguntas
    recuperar: function(){
        var ultimoId = JSON.parse(localStorage.getItem("ultimoId"));

        if (ultimoId >= 1){
            this.ultimoId = ultimoId;
            this.preguntas = JSON.parse(localStorage.getItem("preguntas"));
        }
    },
};
