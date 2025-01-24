import { Router } from "express";
const router = Router();

import productManager from "../managers/product-manager.js";
const manager = new productManager("./src/data/productos.json");


//rpimer punto

router.get("/products", async (req, res) => {
    try {
        const productos = await manager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//renderizar vista:

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
})


export default router;