import ProductModel from "../models/product.model.js";

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.error("Todos los campos son obligatorios");
                throw new Error("Faltan campos obligatorios");
            }

            const existeProducto = await ProductModel.findOne({ code: code });
            if (existeProducto) {
                console.error("El código debe ser único");
                throw new Error("El código ya existe");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            console.log("Producto agregado exitosamente");
        } catch (error) {
            console.error("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts({ limit = 6, page = 1, sort, query } = {}) {
        try {
            const queryOptions = query || {};
            const sortOptions = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

            const [productos, total] = await Promise.all([
                ProductModel.find(queryOptions)
                           .sort(sortOptions)
                           .skip((page - 1) * limit)
                           .limit(limit)
                           .lean(),
                ProductModel.countDocuments(queryOptions)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                docs: productos,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page: parseInt(page),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                totalDocs: total,
                limit: parseInt(limit)
            };
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const producto = await ProductModel.findById(id);
            if (!producto) {
                console.error("Producto no encontrado");
                return null;
            }

            console.log("Producto encontrado con éxito");
            return producto;
        } catch (error) {
            console.error("Error al obtener el producto", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const actualizado = await ProductModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!actualizado) {
                console.error("No se encuentra el producto");
                throw new Error("Producto no encontrado");
            }

            console.log("Producto actualizado");
            return actualizado;
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const eliminado = await ProductModel.findByIdAndDelete(id);
            if (!eliminado) {
                console.error("No se encuentra el producto");
                throw new Error("Producto no encontrado");
            }

            console.log("Producto eliminado correctamente");
            return eliminado;
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;
