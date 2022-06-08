const $d = document;
const $table = $d.querySelector(".crud-table");
const $form = $d.querySelector(".crud-form");
const $title = $d.querySelector(".crud-title");
const $template = $d.getElementById("crud-template").content;
const $fragement = $d.createDocumentFragment();

const getAll = async () => {
    try {
        let res = await axios.get("http://localhost:4444/playas")
        let json = await res.data;
        json.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".estado").textContent = el.estado;
            $template.querySelector(".edit").dataset.id = el.id;
            $template.querySelector(".edit").dataset.name = el.nombre;
            $template.querySelector(".edit").dataset.estado = el.estado;
            $template.querySelector(".delete").dataset.id = el.id;

            let $clone = $d.importNode($template, true);

            $fragement.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragement);
    } catch (error) {
        let message = error.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
    }
}

$d.addEventListener("DOMContentLoaded", getAll);


$d.addEventListener("submit", async e => {
    if (e.target === $form) {

        e.preventDefault();

        if (!e.target.id.value) {
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        estado: e.target.estado.value
                    })
                };

                let res = await axios("http://localhost:4444/playas", options)
                let json = await res.data;

                location.reload();
            } catch (error) {
                
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
            }
        } else {
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        nombre: e.target.nombre.value,
                        estado: e.target.estado.value
                    })
                };

                let res = await axios(`http://localhost:4444/playas/${e.target.id.value}`, options)
                let json = await res.data;

                location.reload();
            } catch (error) {

                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
                
            }
        }
    }
})

$d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        $title.textContent = "EDITAR PLAYA";
        $form.nombre.value = e.target.dataset.name;
        $form.estado.value = e.target.dataset.estado;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")){
        let confirmacion = confirm("¿Estás seguro que deseas eliminar el elemnto seleccionado?")
        
        if (confirmacion) {
            try {
                
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                };

                let res = await axios(`http://localhost:4444/playas/${e.target.dataset.id}`, options)
                let json = await res.data;

                location.reload();
            } catch (error) {
                
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `Error: ${error.status}: ${message}`);
            }
        }
    }
})