let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
let servicios = [];
let indiceEditando = null;


function guardarEnStorage() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}


function mensajeAgregado(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "bottom",
    position: "center",
    style: {
      background: "#28a745"
    }
  }).showToast();
}

function mensajeElimando(mensaje) {
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: "bottom",
    position: "center",
    style: {
      background: "#ff0000ff"
    }
  }).showToast();
}

class Turno {
  constructor(nombre, servicio, precio, fecha, hora) {
    this.nombre = nombre;
    this.servicio = servicio;
    this.precio = precio;
    this.fecha = fecha;
    this.hora = hora;
  }
}


async function cargarServicios() {
  try {
    const response = await fetch("data/servicios.json");
    servicios = await response.json();

    const select = document.getElementById("servicio");

    servicios.forEach(servicio => {
      const option = document.createElement("option");
      option.value = servicio.nombre;
      option.textContent = servicio.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    Swal.fire("Error", "No se pudieron cargar los servicios", "error");
  }
}


function mostrarTurnos() {
  const lista = document.getElementById("listaTurnos");
  lista.innerHTML = "";

  turnos.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = "turno-item";

    li.innerHTML = `
      <strong>Nombre:</strong> ${t.nombre}<br>
      <strong>Servicio:</strong> ${t.servicio}<br>
      <strong>Precio:</strong> $${t.precio}<br>
      <strong>Fecha:</strong> ${t.fecha}<br>
      <strong>Hora:</strong> ${t.hora}
    `;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");
    btnEditar.addEventListener("click", () => editarTurno(index));

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () => eliminarTurno(index));

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });
}

function eliminarTurno(index) {
  Swal.fire({
    title: "¿Eliminar turno?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar"
  }).then(result => {
    if (result.isConfirmed) {
      turnos.splice(index, 1);
      guardarEnStorage();
      mostrarTurnos();
      mensajeElimando("Turno eliminado");
    }
  });
}

function editarTurno(index) {
  const turno = turnos[index];

  document.getElementById("nombre").value = turno.nombre;
  document.getElementById("servicio").value = turno.servicio;
  document.getElementById("fecha").value = turno.fecha;
  document.getElementById("hora").value = turno.hora;

  indiceEditando = index;
  document.querySelector("#formTurno button").textContent = "Guardar cambios";
}


document.getElementById("formTurno").addEventListener("submit", e => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const servicioSeleccionado = document.getElementById("servicio").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !servicioSeleccionado || !fecha || !hora) {
    Swal.fire("Atención", "Completá todos los campos", "warning");
    return;
  }

  const hoy = new Date().toISOString().split("T")[0];
  if (fecha < hoy) {
    Swal.fire("Error", "La fecha no puede ser anterior a hoy", "error");
    return;
  }

  const servicioEncontrado = servicios.find(
    s => s.nombre === servicioSeleccionado
  );

  const precio = servicioEncontrado.precio;

  const turno = new Turno(nombre, servicioSeleccionado, precio, fecha, hora);

  if (indiceEditando === null) {
    turnos.push(turno);
    mensajeAgregado("Turno agregado correctamente");
  } else {
    turnos[indiceEditando] = turno;
    indiceEditando = null;
    document.querySelector("#formTurno button").textContent = "Agregar turno";
    mostrarToast("Turno actualizado correctamente");
  }

  guardarEnStorage();
  mostrarTurnos();
  e.target.reset();
});


cargarServicios();
mostrarTurnos();
