import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const app = express();
const PUERTO = 8080;

import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import viewsRouter from "./routes/views.router.js";

//Middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public"));

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



//rutas 

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


//listen


const httpServer = app.listen(PUERTO, () => {
    console.log(`Estamos escuchando en puerto ${PUERTO}`);
    
})


//websocket:

import productManager from "./managers/product-manager.js";
const manager = new productManager("./src/data/productos.json");


const io = new Server(httpServer);


io.on("connection", async (socket) => {
    console.log("Un Cliente Conectado");
    
  //se envia el array de productos
    socket.emit("productos", await manager.getProducts());

    //se agrega productos:
    socket.on("agregarProducto", async (producto) => {
        await manager.addProduct(producto);
        io.sockets.emit("productos", await manager.getProducts())
    })


    //aca eliminamos el producto:

    socket.on("eliminarProducto", async (id) => {
        try {
            console.log(`Eliminando producto con id: ${id}`);
    
            // Llamamos al método de eliminar producto (puede ser deleteProduct o lo que hayas definido en tu manager)
            await manager.deleteProduct(id);
    
            // Luego de eliminar, obtenemos el listado de productos actualizado
            const productosActualizados = await manager.getProducts();
    
            // Emitimos el listado actualizado a todos los clientes conectados
            socket.emit("productosActualizados", productosActualizados);
    
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("errorEliminarProducto", { error: "No se pudo eliminar el producto." });
        }
    });
})