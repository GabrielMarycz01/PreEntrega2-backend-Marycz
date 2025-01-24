import { Router } from "express";
const router = Router();




//importamos productManager
import productManager from "../managers/product-manager.js";
const manager = new productManager("./src/data/productos.json");



//ruta para listar todos los productos
router.get("/", async (req, res) => {

    //guardamos query limit
    let limit = req.query.limit;

    const productos = await manager.getProducts();

    if(limit){
      res.send(productos.slice(0, limit));
    }else{
        res.send(productos);
    }
})


//ruta para retornar producto por id:

router.get("/:pid", async (req, res) => {
    let id = req.params.pid;
    const productoBuscado = await manager.getProductsById(parseInt(id));
    res.send(productoBuscado);

})

// POST /api/products
router.post("/", async (req, res) => {
    const { title, description, price, img, code, stock, category, thumbnails } = req.body;

    // Validación de campos requeridos
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails." });
    }

    // Validamos si el producto ya existe (por código)
    const productos = await manager.getProducts();
    if (productos.some(prod => prod.code === code)) {
        return res.status(400).json({ error: "El código del producto debe ser único." });
    }

    const nuevoProducto = {
        id: ++productManager.ultId, // Incrementamos el id
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        thumbnails: thumbnails || [], // Si no se manda thumbnails, lo dejamos como array vacío
        status: true // El status es true por defecto
    };

    // Agregar el nuevo producto al archivo
    await manager.addProduct(nuevoProducto);
    res.status(201).json(nuevoProducto); // Respondemos con el producto creado
});


// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, img, code, stock, category, thumbnails, status } = req.body;

    // Buscamos el producto por id
    const producto = await manager.getProductsById(parseInt(pid));
    if (producto === "Not found") {
        return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Actualizamos solo los campos que no sean id
    if (title) producto.title = title;
    if (description) producto.description = description;
    if (price) producto.price = price;
    if (img) producto.img = img;
    if (code) producto.code = code;
    if (stock) producto.stock = stock;
    if (category) producto.category = category;
    if (thumbnails) producto.thumbnails = thumbnails;
    if (status !== undefined) producto.status = status;

    // Guardamos los cambios
    await manager.guardarArchivo(await manager.getProducts());
    res.json(producto);
});



// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    // Buscamos el producto por id
    const productos = await manager.getProducts();
    const index = productos.findIndex(prod => prod.id === parseInt(pid));

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Eliminamos el producto
    productos.splice(index, 1);

    // Guardamos los cambios
    await manager.guardarArchivo(productos);
    res.status(200).json({ message: "Producto eliminado con éxito." });
});







export default router;