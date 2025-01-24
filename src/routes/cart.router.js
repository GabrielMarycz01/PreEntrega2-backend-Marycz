import { Router } from "express";
const router = Router();
//lamamos al cartmanager
import cartManager from "../managers/cart-manager.js"
const manager = new cartManager("./src/data/carts.json")


//1) crear nuevo carrito 


router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({error: "Error al intentar crear un carrito"});
    }
})



//2) listamos los productos que pertenesen a determinado carrito:

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const carritoBuscado = await manager.getCarritoByid(cartId);
        res.json(carritoBuscado.products);  
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Todo salio mal"})
    }
})




//3) agregamos productos al carrito:
router.post("/:cid/product/:pid", async (req,res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;


    try {
        const actualizarCarrito = await manager.agregarProductosAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);

    } catch (error) {
        console.error("Error en agregar producto al carrito:", error);
        res.status(500).json({ error: error.message, stack: error.stack });
        //res.status(500).json({error: "Error"});
    }
})



export default router;