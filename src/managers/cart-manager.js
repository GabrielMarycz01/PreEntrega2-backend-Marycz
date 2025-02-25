import CartModel from "../models/cart.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error("Error al crear carrito", error);
            throw error; // Es buena práctica lanzar el error para manejarlo en otro lugar
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) {
                console.log("No existe ese carrito con el id:", cartId);
                return null;
            }
            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            // Marcamos propiedad como modificada
            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            carrito.products = carrito.products.filter(item => item.product.toString() !== productId);
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            throw error;
        }
    }

    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            carrito.products = updatedProducts;
            carrito.markModified('products');
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        }
    }

    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = carrito.products.findIndex(item => item.product.toString() === productId);
            if (productIndex !== -1) {
                carrito.products[productIndex].quantity = newQuantity;
                carrito.markModified('products');
                await carrito.save();
                return carrito;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto", error);
            throw error;
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const carrito = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }
            return carrito;
        } catch (error) {
            console.error("Error al vaciar el carrito", error);
            throw error;
        }
    }
}

export default CartManager;
