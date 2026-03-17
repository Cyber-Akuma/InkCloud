let botonEstadisticasActivo = false;
let botonBusquedaActivado = false;
let notasDestacadas = [];
let notas = [];
let notaEditando = null;
let notasBorradas = 0;
let notasModificadas = 0;

function guardarEnStorage() {
    localStorage.setItem("notasDestacadas", JSON.stringify(notasDestacadas));
    localStorage.setItem("notas", JSON.stringify(notas));
}

function cargarDesdeStorage() {
    const destacadas = localStorage.getItem("notasDestacadas");
    const normales = localStorage.getItem("notas");
    if (destacadas) notasDestacadas = JSON.parse(destacadas);
    if (normales) notas = JSON.parse(normales);
    mostrarNotasDestacadas();
    mostrarNotas();
}

function mostrarEstadisticas() {
    const nav = document.getElementById("Nav");
    const nota = document.getElementById("contenedorNotasPrioridad");
    const notaSin = document.getElementById("contenedorNotasSinPrioridad");
    botonEstadisticasActivo = !botonEstadisticasActivo;

    if (botonEstadisticasActivo) {
        nav.style.display = "block";
        nota.style.paddingLeft = "35px";
        notaSin.style.paddingLeft = "35px";
        renderizarEstadisticas();
    } else {
        nav.style.display = "none";
        nota.style.paddingLeft = "90px";
        notaSin.style.paddingLeft = "90px";
    }
}

function renderizarEstadisticas() {
    const nav = document.getElementById("Nav");
    if (!botonEstadisticasActivo) return;

    const totalActivas = notasDestacadas.length + notas.length;
    const totalLetras = [...notasDestacadas, ...notas].reduce((acc, n) => acc + n.titulo.length + n.texto.length, 0);
    const mediaLetras = totalActivas > 0 ? (totalLetras / totalActivas).toFixed(1) : 0;

    nav.innerHTML = `
        <div class="estadisticas">
            <h3 class="estadisticasTitulo">Estadísticas</h3>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Notas activas</span>
                <span class="estadisticaValor">${totalActivas}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Notas borradas</span>
                <span class="estadisticaValor">${notasBorradas}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Notas modificadas</span>
                <span class="estadisticaValor">${notasModificadas}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Con prioridad</span>
                <span class="estadisticaValor">${notasDestacadas.length}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Sin prioridad</span>
                <span class="estadisticaValor">${notas.length}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Total de letras</span>
                <span class="estadisticaValor">${totalLetras}</span>
            </div>
            <div class="estadisticaItem">
                <span class="estadisticaLabel">Media de letras</span>
                <span class="estadisticaValor">${mediaLetras}</span>
            </div>
        </div>
    `;
}

function anadirNota() {
    if (document.getElementById("anadirNota")) return;
    const modal = document.createElement("div");
    modal.id = "anadirNota";
    modal.className = "modal";

    modal.innerHTML = `
    <div class="anadirNotaD" style="display:flex;gap:20px;">
        <div style="flex:1;">
            <h2>Añadir nota</h2>
            <div class="contenedorFormilario">
                <div><input class="inputs" type="text" id="tituloNota" placeholder="Título"></div>
                <div>
                    <button type="button" id="botonPrioridad" class="botonprioridad" data-prioridad="baja">
                        <img id="iconoPrioridad" src="./Iconos/icons8-estrella-sinPrioridad.png" class="icono-star">
                    </button>
                    <input type="hidden" id="prioridad" value="baja">
                </div>
            </div>
            <div class="contenedorFormilario">
                <div><textarea id="textoNota" rows="4" placeholder="Escribe tu nota..."></textarea></div>
                <div><input type="color" id="colorTexto" value="#000000"></div>
            </div>
            <div class="contenedorFormilario">
                <div>
                    <select id="seleccionDegradado">
                        <option value="none">Sin degradado</option>
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                        <option value="conic">Cónico</option>
                        <option value="url">Imagen</option>
                    </select>
                </div>
                <div><label>Color fondo</label><br><input type="color" id="colorFondo" value="#ffffff"></div>
                <div><label>Color inicio</label><br><input type="color" id="colorGradInicio" value="#ff8a80"></div>
                <div><label>Color fin</label><br><input type="color" id="colorGradFin" value="#ffd180"></div>
                <div><label>Imagen (URL)</label><br><input type="url" id="colorUrl" placeholder="https://..."></div>
            </div>
            <div class="caja">
                <button id="GuardarNota" class="boton">Guardar nota</button>
                <button id="cerrarModal" class="boton">Cancelar</button>
            </div>
        </div>
        <div id="vistaPrevia" class="contenedorVista">Vista previa</div>
    </div>
    `;
    document.body.appendChild(modal);

    const btnPrioridad = modal.querySelector("#botonPrioridad");
    const icono = modal.querySelector("#iconoPrioridad");
    const prioridadInput = modal.querySelector("#prioridad");

    btnPrioridad.onclick = () => {
        if (btnPrioridad.dataset.prioridad === "baja") {
            btnPrioridad.dataset.prioridad = "alta";
            icono.src = "./Iconos/icons8-estrella-prioridad.png";
            prioridadInput.value = "alta";
        } else {
            btnPrioridad.dataset.prioridad = "baja";
            icono.src = "./Iconos/icons8-estrella-sinPrioridad.png";
            prioridadInput.value = "baja";
        }
    };

    const select = modal.querySelector("#seleccionDegradado");
    const campoFondo = modal.querySelector("#colorFondo").parentElement;
    const campoGradInicio = modal.querySelector("#colorGradInicio").parentElement;
    const campoGradFin = modal.querySelector("#colorGradFin").parentElement;
    const campoUrl = modal.querySelector("#colorUrl").parentElement;
    const campoTexto = modal.querySelector("#colorTexto").parentElement;

    function actualizarCampos() {
        const v = select.value;
        campoFondo.style.display = "none";
        campoGradInicio.style.display = "none";
        campoGradFin.style.display = "none";
        campoUrl.style.display = "none";
        campoTexto.style.display = "block";
        if (v === "none") campoFondo.style.display = "block";
        else if (v === "url") campoUrl.style.display = "block";
        else {
            campoGradInicio.style.display = "block";
            campoGradFin.style.display = "block";
        }
        crearVistaPrevia();
    }

    function crearVistaPrevia() {
        const vista = modal.querySelector("#vistaPrevia");
        const grad = select.value;
        let style = "";

        if (grad === "none") style += `background:${modal.querySelector("#colorFondo").value};`;
        else if (grad === "url") {
            const url = modal.querySelector("#colorUrl").value.trim();
            if (url) style += `background-image:url('${url}');background-size:cover;background-position:center;`;
        } else {
            const ini = modal.querySelector("#colorGradInicio").value;
            const fin = modal.querySelector("#colorGradFin").value;
            if (grad === "linear") style += `background:linear-gradient(135deg,${ini},${fin});`;
            if (grad === "radial") style += `background:radial-gradient(circle,${ini},${fin});`;
            if (grad === "conic") style += `background:conic-gradient(${ini},${fin});`;
        }
        style += `color:${modal.querySelector("#colorTexto").value};`;
        vista.style = style;
        vista.textContent = modal.querySelector("#tituloNota").value.trim() || "Vista previa";
    }

    actualizarCampos();
    select.addEventListener("change", actualizarCampos);
    modal.querySelectorAll("input,textarea").forEach(c => c.addEventListener("input", crearVistaPrevia));

    const guardarBtn = modal.querySelector("#GuardarNota");
    guardarBtn.onclick = () => {
        const titulo = modal.querySelector("#tituloNota").value.trim();
        const texto = modal.querySelector("#textoNota").value.trim();
        const prioridad = modal.querySelector("#prioridad").value;
        const grad = select.value;
        if (!titulo || !texto) return;

        let background = "";
        if (grad === "none") background = modal.querySelector("#colorFondo").value;
        else if (grad === "url") {
            const url = modal.querySelector("#colorUrl").value.trim();
            background = url ? `url('${url}')` : "#ffffff";
        } else {
            const ini = modal.querySelector("#colorGradInicio").value;
            const fin = modal.querySelector("#colorGradFin").value;
            if (grad === "linear") background = `linear-gradient(135deg,${ini},${fin})`;
            if (grad === "radial") background = `radial-gradient(circle,${ini},${fin})`;
            if (grad === "conic") background = `conic-gradient(${ini},${fin})`;
        }

        const colorTexto = modal.querySelector("#colorTexto").value;

        if (notaEditando) {
            notaEditando.titulo = titulo;
            notaEditando.texto = texto;
            notaEditando.background = background;
            notaEditando.colorTexto = colorTexto;
            notaEditando.prioridad = prioridad;
            notaEditando = null;
        } else {
            const notaNueva = { titulo, texto, prioridad, background, colorTexto };
            if (prioridad === "alta") notasDestacadas.push(notaNueva);
            else notas.push(notaNueva);
        }

        cerrarModalNota();
        mostrarNotasDestacadas();
        mostrarNotas();
    };

    modal.querySelector("#cerrarModal").onclick = () => {
        notaEditando = null;
        cerrarModalNota();
    };
}

function cerrarModalNota() {
    const modal = document.getElementById("anadirNota");
    if (modal) modal.remove();
}

function abrirModalEditar(arrayNotas, index) {
    const nota = arrayNotas[index];
    notaEditando = nota;
    
    cerrarModalNota();
    
    let modal = document.createElement("div");
    modal.id = "anadirNota";
    modal.className = "modal";

    modal.innerHTML = `
    <div class="anadirNotaD" style="display:flex;gap:20px;">
        <div style="flex:1;">
            <h2>Editar nota</h2>
            <div class="contenedorFormilario">
                <div><input class="inputs" type="text" id="tituloNota" placeholder="Título" value="${nota.titulo}"></div>
                <div>
                    <button type="button" id="botonPrioridad" class="botonprioridad" data-prioridad="${nota.prioridad}">
                        <img id="iconoPrioridad" src="./Iconos/icons8-estrella-${nota.prioridad === 'alta' ? 'prioridad' : 'sinPrioridad'}.png" class="icono-star">
                    </button>
                    <input type="hidden" id="prioridad" value="${nota.prioridad}">
                </div>
            </div>
            <div class="contenedorFormilario">
                <div><textarea id="textoNota" rows="4" placeholder="Escribe tu nota...">${nota.texto}</textarea></div>
                <div><input type="color" id="colorTexto" value="${nota.colorTexto || '#000000'}"></div>
            </div>
            <div class="contenedorFormilario">
                <div>
                    <select id="seleccionDegradado">
                        <option value="none">Sin degradado</option>
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                        <option value="conic">Cónico</option>
                        <option value="url">Imagen</option>
                    </select>
                </div>
                <div><label>Color fondo</label><br><input type="color" id="colorFondo" value="#ffffff"></div>
                <div><label>Color inicio</label><br><input type="color" id="colorGradInicio" value="#ff8a80"></div>
                <div><label>Color fin</label><br><input type="color" id="colorGradFin" value="#ffd180"></div>
                <div><label>Imagen (URL)</label><br><input type="url" id="colorUrl" placeholder="https://..."></div>
            </div>
            <div class="caja">
                <button id="GuardarNota" class="boton">Guardar cambios</button>
                <button id="cerrarModal" class="boton">Cancelar</button>
            </div>
        </div>
        <div id="vistaPrevia" class="contenedorVista">Vista previa</div>
    </div>
    `;
    document.body.appendChild(modal);

    const btnPrioridad = modal.querySelector("#botonPrioridad");
    const icono = modal.querySelector("#iconoPrioridad");
    const prioridadInput = modal.querySelector("#prioridad");

    btnPrioridad.onclick = () => {
        if (btnPrioridad.dataset.prioridad === "baja") {
            btnPrioridad.dataset.prioridad = "alta";
            icono.src = "./Iconos/icons8-estrella-prioridad.png";
            prioridadInput.value = "alta";
        } else {
            btnPrioridad.dataset.prioridad = "baja";
            icono.src = "./Iconos/icons8-estrella-sinPrioridad.png";
            prioridadInput.value = "baja";
        }
    };

    const select = modal.querySelector("#seleccionDegradado");
    const campoFondo = modal.querySelector("#colorFondo").parentElement;
    const campoGradInicio = modal.querySelector("#colorGradInicio").parentElement;
    const campoGradFin = modal.querySelector("#colorGradFin").parentElement;
    const campoUrl = modal.querySelector("#colorUrl").parentElement;
    const campoTexto = modal.querySelector("#colorTexto").parentElement;

    if (nota.background.startsWith('url')) {
        select.value = 'url';
        const urlMatch = nota.background.match(/url\('(.+)'\)/);
        if (urlMatch) modal.querySelector("#colorUrl").value = urlMatch[1];
    } else if (nota.background.startsWith('linear-gradient')) {
        select.value = 'linear';
        const colors = nota.background.match(/#[0-9a-f]{6}/gi);
        if (colors && colors.length >= 2) {
            modal.querySelector("#colorGradInicio").value = colors[0];
            modal.querySelector("#colorGradFin").value = colors[1];
        }
    } else if (nota.background.startsWith('radial-gradient')) {
        select.value = 'radial';
        const colors = nota.background.match(/#[0-9a-f]{6}/gi);
        if (colors && colors.length >= 2) {
            modal.querySelector("#colorGradInicio").value = colors[0];
            modal.querySelector("#colorGradFin").value = colors[1];
        }
    } else if (nota.background.startsWith('conic-gradient')) {
        select.value = 'conic';
        const colors = nota.background.match(/#[0-9a-f]{6}/gi);
        if (colors && colors.length >= 2) {
            modal.querySelector("#colorGradInicio").value = colors[0];
            modal.querySelector("#colorGradFin").value = colors[1];
        }
    } else {
        select.value = 'none';
        modal.querySelector("#colorFondo").value = nota.background;
    }

    function actualizarCampos() {
        const v = select.value;
        campoFondo.style.display = "none";
        campoGradInicio.style.display = "none";
        campoGradFin.style.display = "none";
        campoUrl.style.display = "none";
        campoTexto.style.display = "block";
        if (v === "none") campoFondo.style.display = "block";
        else if (v === "url") campoUrl.style.display = "block";
        else {
            campoGradInicio.style.display = "block";
            campoGradFin.style.display = "block";
        }
        crearVistaPrevia();
    }

    function crearVistaPrevia() {
        const vista = modal.querySelector("#vistaPrevia");
        const grad = select.value;
        let style = "";

        if (grad === "none") style += `background:${modal.querySelector("#colorFondo").value};`;
        else if (grad === "url") {
            const url = modal.querySelector("#colorUrl").value.trim();
            if (url) style += `background-image:url('${url}');background-size:cover;background-position:center;`;
        } else {
            const ini = modal.querySelector("#colorGradInicio").value;
            const fin = modal.querySelector("#colorGradFin").value;
            if (grad === "linear") style += `background:linear-gradient(135deg,${ini},${fin});`;
            if (grad === "radial") style += `background:radial-gradient(circle,${ini},${fin});`;
            if (grad === "conic") style += `background:conic-gradient(${ini},${fin});`;
        }
        style += `color:${modal.querySelector("#colorTexto").value};`;
        vista.style = style;
        vista.textContent = modal.querySelector("#tituloNota").value.trim() || "Vista previa";
    }

    actualizarCampos();
    select.addEventListener("change", actualizarCampos);
    modal.querySelectorAll("input,textarea").forEach(c => c.addEventListener("input", crearVistaPrevia));

    const guardarBtn = modal.querySelector("#GuardarNota");
    guardarBtn.onclick = () => {
        const titulo = modal.querySelector("#tituloNota").value.trim();
        const texto = modal.querySelector("#textoNota").value.trim();
        const prioridad = modal.querySelector("#prioridad").value;
        const grad = select.value;
        if (!titulo || !texto) return;

        let background = "";
        if (grad === "none") background = modal.querySelector("#colorFondo").value;
        else if (grad === "url") {
            const url = modal.querySelector("#colorUrl").value.trim();
            background = url ? `url('${url}')` : "#ffffff";
        } else {
            const ini = modal.querySelector("#colorGradInicio").value;
            const fin = modal.querySelector("#colorGradFin").value;
            if (grad === "linear") background = `linear-gradient(135deg,${ini},${fin})`;
            if (grad === "radial") background = `radial-gradient(circle,${ini},${fin})`;
            if (grad === "conic") background = `conic-gradient(${ini},${fin})`;
        }

        const colorTexto = modal.querySelector("#colorTexto").value;

        const prioridadAnterior = notaEditando.prioridad;
        
        notaEditando.titulo = titulo;
        notaEditando.texto = texto;
        notaEditando.background = background;
        notaEditando.colorTexto = colorTexto;
        notaEditando.prioridad = prioridad;

        if (prioridadAnterior !== prioridad) {
            if (prioridadAnterior === "alta") {
                const idx = notasDestacadas.indexOf(notaEditando);
                if (idx > -1) {
                    notasDestacadas.splice(idx, 1);
                    notas.push(notaEditando);
                }
            } else {
                const idx = notas.indexOf(notaEditando);
                if (idx > -1) {
                    notas.splice(idx, 1);
                    notasDestacadas.push(notaEditando);
                }
            }
        }

        notasModificadas++;
        notaEditando = null;
        cerrarModalNota();
        mostrarNotasDestacadas();
        mostrarNotas();
    };

    modal.querySelector("#cerrarModal").onclick = () => {
        notaEditando = null;
        cerrarModalNota();
    };
}

function mostrarNotasDestacadas() {
    const contenedor = document.getElementById("contenedorNotasPrioridad");
    contenedor.innerHTML = "";
    notasDestacadas.forEach((nota, index) => {
        const div = document.createElement("div");
        div.className = "notas";
        div.style.background = nota.background || "#ffffff";
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = "center";
        div.style.color = nota.colorTexto || "#000000";
        div.innerHTML = `
            <h3>${nota.titulo}</h3>
            <p>${nota.texto}</p>
            <div class="contenedorBotonesNotas">
                <button class="botNotas"><img src="./Iconos/icons8-estrella-prioridad.png" class="iconoNota"></button>
                <button class="botNotas editarBtn"><img src="./Iconos/icons8-editar-propiedad-80.png" class="iconoNota"></button>
                <button class="botNotas eliminarBtn"><img src="./Iconos/icons8-eliminar-100.png" class="iconoNota"></button>
            </div>
        `;
        contenedor.appendChild(div);

        div.querySelector(".editarBtn").onclick = () => abrirModalEditar(notasDestacadas, index);
        div.querySelector(".eliminarBtn").onclick = () => mostrarModalConfirmacion("¿Deseas eliminar esta nota?", () => {
            notasDestacadas.splice(index, 1);
            notasBorradas++;
            mostrarNotasDestacadas();
            mostrarNotas();
        });
    });
    guardarEnStorage();
    renderizarEstadisticas();
}

function mostrarNotas() {
    const contenedor = document.getElementById("contenedorNotasSinPrioridad");
    contenedor.innerHTML = "";
    notas.forEach((nota, index) => {
        const div = document.createElement("div");
        div.className = "notas";
        div.style.background = nota.background || "#ffffff";
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = "center";
        div.style.color = nota.colorTexto || "#000000";
        div.innerHTML = `
            <h3>${nota.titulo}</h3>
            <p>${nota.texto}</p>
            <div class="contenedorBotonesNotas">
                <button class="botNotas"><img src="./Iconos/icons8-estrella-sinPrioridad.png" class="iconoNota"></button>
                <button class="botNotas editarBtn"><img src="./Iconos/icons8-editar-propiedad-80.png" class="iconoNota"></button>
                <button class="botNotas eliminarBtn"><img src="./Iconos/icons8-eliminar-100.png" class="iconoNota"></button>
            </div>
        `;
        contenedor.appendChild(div);

        div.querySelector(".editarBtn").onclick = () => abrirModalEditar(notas, index);
        div.querySelector(".eliminarBtn").onclick = () => mostrarModalConfirmacion("¿Deseas eliminar esta nota?", () => {
            notas.splice(index, 1);
            notasBorradas++;
            mostrarNotasDestacadas();
            mostrarNotas();
        });
    });
    guardarEnStorage();
    renderizarEstadisticas();
}

function mostrarModalConfirmacion(mensaje, onConfirm) {
    if (document.getElementById("modalConfirmacion")) return;

    const modal = document.createElement("div");
    modal.id = "modalConfirmacion";
    modal.className = "modal";
    modal.innerHTML = `
        <div style="background:#fff; padding:30px; border-radius:20px; text-align:center; min-width:300px;">
            <p style="font-size:18px; margin-bottom:20px;">${mensaje}</p>
            <div style="display:flex; justify-content:center; gap:20px;">
                <button id="confirmarBtn" class="boton">Confirmar</button>
                <button id="cancelarBtn" class="boton">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#confirmarBtn").onclick = () => { onConfirm(); modal.remove(); };
    modal.querySelector("#cancelarBtn").onclick = () => modal.remove();
}

function buscarNota() {
    const busqueda = document.getElementById("contenedorBusqueda");

    if (!botonBusquedaActivado) {
        busqueda.innerHTML = `
            <div class="contenedorBusqueda">
                <input class="inputs" type="text" id="buscarTitulo" placeholder="Título...">
                <button id="botonBuscar">Buscar</button>
            </div>
            <div class="separador" id="separadorEncabezado"></div>
        `;
        busqueda.style.display = "block";
        botonBusquedaActivado = true;

        document.getElementById("botonBuscar").onclick = () => {
            const texto = document.getElementById("buscarTitulo").value.trim().toLowerCase();

            if (texto === "") {
                mostrarNotasDestacadas();
                mostrarNotas();
                return;
            }

            const filtradasDestacadas = notasDestacadas.filter(n =>
                n.titulo.toLowerCase().includes(texto)
            );

            const filtradasNormales = notas.filter(n =>
                n.titulo.toLowerCase().includes(texto)
            );

            mostrarNotasFiltradas(filtradasDestacadas, filtradasNormales);
        };

    } else {
        busqueda.innerHTML = "";
        busqueda.style.display = "none";
        botonBusquedaActivado = false;

        mostrarNotasDestacadas();
        mostrarNotas();
    }
}

function mostrarNotasFiltradas(destacadas, normales) {
    const contDest = document.getElementById("contenedorNotasPrioridad");
    const contNorm = document.getElementById("contenedorNotasSinPrioridad");

    contDest.innerHTML = "";
    contNorm.innerHTML = "";

    destacadas.forEach((nota, index) => {
        const div = document.createElement("div");
        div.className = "notas";
        div.style.background = nota.background;
        div.style.color = nota.colorTexto;
        div.innerHTML = `
            <h3>${nota.titulo}</h3>
            <p>${nota.texto}</p>
        `;
        contDest.appendChild(div);
    });

    normales.forEach((nota, index) => {
        const div = document.createElement("div");
        div.className = "notas";
        div.style.background = nota.background;
        div.style.color = nota.colorTexto;
        div.innerHTML = `
            <h3>${nota.titulo}</h3>
            <p>${nota.texto}</p>
        `;
        contNorm.appendChild(div);
    });
}

cargarDesdeStorage();
