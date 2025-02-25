import express from "express";
import ProductManager from "../managers/product-manager.js";

const router = express.Router();
const manager = new ProductManager();

// Ruta para listar todos los productos
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await manager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        });

        res.json({
            status: "success",
            payload: productos.docs, // Asegúrate de acceder a la lista de productos
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.prevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.nextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        console.error("Error al traer los productos", error);
        res.status(500).json({
            status: "error",
            message: "Error al traer los productos",
        });
    }
});

// Ruta para retornar producto por ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await manager.getProductById(id);
        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);
    } catch (error) {
        console.error("Error al traer el producto por ID", error);
        res.status(500).json({
            error: "Error al traer el producto por ID"
        });
    }
});

// Agregar un producto nuevo
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    // Validación simple de campos requeridos
    if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.price || !nuevoProducto.code || !nuevoProducto.stock || !nuevoProducto.category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).json({
            message: "Producto agregado con éxito"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error al agregar producto"
        });
    }
});

// Actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        const result = await manager.updateProduct(id, productoActualizado);
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({
            message: "Producto actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error al actualizar producto"
        });
    }
});

// Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const result = await manager.deleteProduct(id);
        if (!result) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({
            message: "Producto eliminado con éxito"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error al eliminar producto"
        });
    }
});

export default router;
