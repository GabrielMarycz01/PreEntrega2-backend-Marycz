import express from "express";  
import ProductManager from "../managers/product-manager.js";
import CartManager from "../managers/cart-manager.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5, sort, category } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            query: category ? { category } : undefined
        };

        const products = await productManager.getProducts(options);

        res.render("products", {
            productos: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            limit: products.limit,
            totalDocs: products.totalDocs,
            sort: sort || '',
            category: category || ''
        });
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).render('error', { error: "Error al obtener los productos" });
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
       const producto = await productManager.getProductById(req.params.pid);
       
       if (!producto) {
          return res.status(404).render('error', { error: 'Producto no encontrado' });
       }
 
       res.render("product-detail", { 
          producto: producto.toObject(),
          title: producto.title 
       });
    } catch (error) {
       console.error("Error al obtener producto", error);
       res.status(500).render('error', { error: "Error interno del servidor" });
    }
});
 
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
 
    try {
       const carrito = await cartManager.getCarritoById(cartId);
 
       if (!carrito) {
          console.log("No existe ese carrito con el ID:", cartId);
          return res.status(404).render('error', { error: "Carrito no encontrado" });
       }
 
       const productosEnCarrito = carrito.products.map(item => ({
          product: item.product.toObject(),
          quantity: item.quantity
       }));
 
       res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
       console.error("Error al obtener el carrito", error);
       res.status(500).render('error', { error: "Error interno al obtener el carrito" });
    }
});

export default router;
