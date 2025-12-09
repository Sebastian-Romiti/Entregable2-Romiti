let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

function guardarEnStorage() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

function Turno(nombre, servicio, fecha, hora) {
  this.nombre = nombre;
  this.servicio = servicio;
  this.fecha = fecha;
  this.hora = hora;
}

function agregarTurno(turno) {
  turnos.push(turno);
  guardarEnStorage();
  mostrarTurnos();
}

function mostrarTurnos() {
  const lista = document.getElementById("listaTurnos");
  lista.innerHTML = "";

  turnos.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = "turno-item";
    li.innerHTML = `
            <strong>Nombre:</strong> ${t.nombre}
            <br> 
            <strong>Servicio:</strong> ${t.servicio}
            <br>
            <strong>Fecha:</strong> ${t.fecha}
            <br>
            <strong>Hora:</strong> ${t.hora}
            <br>

            <button style="background:red" onclick="eliminarTurno(${index})">Eliminar</button>
        `;
    lista.appendChild(li);
  });
}

function eliminarTurno(index) {
  turnos.splice(index, 1);
  guardarEnStorage();
  mostrarTurnos();
}

document.getElementById("formTurno").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const servicio = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  const nuevoTurno = new Turno(nombre, servicio, fecha, hora);

  agregarTurno(nuevoTurno);

  document.getElementById("formTurno").reset();
});

mostrarTurnos();
