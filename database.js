import mongoose from "mongoose";
import ProductModel from "./models/product.model.js";

try {
    await mongoose.connect("mongodb+srv://gabrielmarycz:marycz1>@clustercoder01.oisn4.mongodb.net/PreEntregaFinal3?retryWrites=true&w=majority&appName=ClusterCoder01");
    // Limpiar la colección de productos al iniciar
    await ProductModel.deleteMany({});
    console.log("Conectado a la base de datos y productos anteriores eliminados");
} catch (error) {
    console.error("Error al conectarse a la base de datos", error);
    process.exit(1);
}