import { validationResult } from "express-validator";
import { obtenerTodosLosPaises, eliminarPaisPorId, obtenerPaisPorId, crearPais, actualizarPais,
  } from '../services/PaisService.mjs';

export async function obtenerDashboardPais(req, res) {
    try {
        const paises = await obtenerTodosLosPaises();
        res.render("dashboard", { 
            layout: 'layout',
            title: "Lista de Paises", 
            paises 
        });
    } catch (error) {
        res.status(500).send("Error al cargar el dashboard");
    }

}
export async function obtenerPaisesJSON(req, res) {
    try {
        const paises = await obtenerTodosLosPaises();
        res.status(200).json(paises);
    } catch (error) {
        console.error('Error al obtener los países:', error.message);
        res.status(500).json({ error: 'Error al obtener los países' });
    }
}
//  Controlador para procesar el formulario y agregar pais
export async function agregarPaisController(req, res) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const nuevoPais = await crearPais(req.body);
        res.redirect("/api/pais");
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar el país", error: error.message });
    }
}

export function mostrarFormularioAgregarController(req, res) {
    res.render('addPais',{
        layout: 'layout',
        title: 'Agregar Pais'

}); // Sin lógica extra porque no cargás datos
}
export async function eliminarPaisController(req, res) {
    try {
        const { id } = req.params;
        await eliminarPaisPorId(id);
        //await eliminarTodosLosPaises();

        res.redirect('/api/pais');
    } catch (error) {
        res.status(500).send({ mensaje: "Error al eliminar el pais", error: error.message });
    }
}

export async function mostrarFormularioEditarController(req, res) {
    const { id } = req.params; //extrae id de la url

    try {
        const pais = await obtenerPaisPorId(id);

        if (!pais) {
            return res.status(404).send('Pais no encontrado');
        }

        res.render('editPais', { 
            layout: 'layout',
            title: 'Editar Pais',
            pais });
    } catch (error) {
        res.status(500).send('Error al obtener el pais');
    }
}
export async function editarPaisController(req, res) {
    if (req.body.capital && typeof req.body.capital === "string") {
        req.body.capital = req.body.capital
            .split(",")
            .map(c => c.trim())
            .filter(Boolean);
    }

    if (req.body.borders && typeof req.body.borders === "string") {
        req.body.borders = req.body.borders
            .split(",")
            .map(b => b.trim())
            .filter(Boolean);
    }

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const paisActualizado = await actualizarPais(id, datosActualizados);

        if (!paisActualizado) {
            return res.status(404).send({ mensaje: "Pais no encontrado" });
        }

        res.redirect('/api/pais');
    } catch (error) {
        res.status(500).send({ mensaje: "Error al actualizar el pais", error: error.message });
    }
}