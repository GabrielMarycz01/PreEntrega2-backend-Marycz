import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/product-manager.js"; // Asegúrate de importar tu ProductManager

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Configuración de Express-Handlebars
app.engine("handlebars", engine({
    helpers: {
        eq: (a, b) => a === b // Define el helper eq
    }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Conexión a la base de datos
const connectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://gabrielmarycz:marycz01@clustercoder01.oisn4.mongodb.net/PreEntregaFinal3?retryWrites=true&w=majority&appName=ClusterCoder01");
        console.log("Conectado a la base de datos");
        
        // Iniciar el servidor solo después de una conexión exitosa
        const httpServer = app.listen(PUERTO, () => {
            console.log(`Estamos escuchando en puerto ${PUERTO}`);
        });

        // WebSocket
        const io = new Server(httpServer);
        const manager = new ProductManager(); // Asegúrate de inicializar tu ProductManager

        io.on("connection", async (socket) => {
            console.log("Un Cliente Conectado");
            
            // Se envía el array de productos
            socket.emit("productos", await manager.getProducts());

            // Se agrega productos
            socket.on("agregarProducto", async (producto) => {
                await manager.addProduct(producto);
                io.sockets.emit("productos", await manager.getProducts());
            });

            // Eliminamos el producto
            socket.on("eliminarProducto", async (id) => {
                try {
                    console.log(`Eliminando producto con id: ${id}`);
                    await manager.deleteProduct(id);
                    const productosActualizados = await manager.getProducts();
                    io.sockets.emit("productos", productosActualizados);
                } catch (error) {
                    console.error("Error al eliminar el producto:", error);
                    socket.emit("errorEliminarProducto", { error: "No se pudo eliminar el producto." });
                }
            });
        });

    } catch (error) {
        console.error("Error al conectarse a la base de datos", error);
        process.exit(1);
    }
};

// Llamar a la función para conectar a la base de datos
connectToDatabase();
