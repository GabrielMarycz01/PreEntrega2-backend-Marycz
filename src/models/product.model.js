import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { 
            type: Number, 
            required: true, 
            min: 0 // Asegura que el precio no sea negativo
        },
        category: { type: String, required: true },
        status: { type: Boolean, default: true },
        img: { type: String }, // Campo opcional para la URL de la imagen
    },
    { timestamps: true } // Agrega timestamps para seguimiento
);

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;
