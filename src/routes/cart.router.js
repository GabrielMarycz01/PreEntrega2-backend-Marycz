import { Router } from "express";
const router = Router();
import CartManager from "../managers/cart-manager.js"; // Asegúrate de que la importación sea correcta
const manager = new CartManager(); // No se necesita el archivo de JSON aquí

// 1) Crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error al intentar crear un carrito" });
    }
});

// 2) Listar los productos que pertenecen a determinado carrito:
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid; // No uses parseInt aquí

    try {
        const carritoBuscado = await manager.getCarritoById(cartId); // Usa el manager
        if (!carritoBuscado) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(carritoBuscado.products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Todo salió mal" });
    }
});

// 3) Agregar productos al carrito:
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid; // No uses parseInt aquí
    const productId = req.params.pid; // No uses parseInt aquí
    const quantity = req.body.quantity || 1;

    try {
        const carritoActualizado = await manager.agregarProductoAlCarrito(cartId, productId, quantity); // Asegúrate de que la función exista
        res.json(carritoActualizado.products);
    } catch (error) {
        console.error("Error en agregar producto al carrito:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4) Eliminar productos del carrito:
router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid; // No uses parseInt aquí
    const productId = req.params.pid; // No uses parseInt aquí

    try {
        const carritoActualizado = await manager.eliminarProductoDelCarrito(cartId, productId);
        res.json({
            status: "success",
            message: "Producto eliminado del carrito",
            carritoActualizado,
        });
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({
            status: "error",
            error: "Error del servidor"
        });
    }
});

// 5) Actualizar datos del carrito:
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const carritoActualizado = await manager.actualizarCarrito(cartId, updatedProducts);
        res.json(carritoActualizado);
    } catch (error) {
        console.log("Error al actualizar carrito", error);
        res.status(500).json({
            status: "error",
            error: "Error del servidor",
        });
    }
});

// 6) Actualizar cantidades de productos:
router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid; // Cambiado de params.id a params.cid
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const carritoActualizado = await manager.actualizarCantidadDeProducto(cartId, productId, newQuantity);
        res.json({
            status: "success",
            message: "Producto actualizado",
            carritoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto", error);
        res.status(500).json({
            status: "error",
            error: "Error del servidor"
        });
    }
});

// 7) Vaciar carrito:
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid; // No uses parseInt aquí

    try {
        const carritoActualizado = await manager.vaciarCarrito(cartId);
        res.json({
            status: "success",
            message: "Carrito vaciado",
            carritoActualizado,
        });
    } catch (error) {
        console.error("Error al vaciar el carrito", error);
        res.status(500).json({
            status: "error",
            error: "Error del servidor"
        });
    }
});

export default router;
