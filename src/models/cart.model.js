import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1 // Asegura que la cantidad sea al menos 1
                }
            }
        ]
    },
    { timestamps: true } // Agrega timestamps para seguimiento
);

// Middleware para populate
cartSchema.pre(['find', 'findOne'], function(next) {
    this.populate('products.product');
    next();
});

// Evitar el error OverwriteModelError
const CartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;

