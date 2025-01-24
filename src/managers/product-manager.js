import { promises as fs } from "fs";



class productManager {
  static ultId = 0; // Esta es la variable que debe mantener el id más alto actual

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Inicialización para leer el archivo y actualizar ultId con el valor más alto de id
  async init() {
    const arrayProductos = await this.leerArchivo();
    if (arrayProductos.length > 0) {
      // Actualiza ultId al máximo id + 1
      productManager.ultId =
        Math.max(...arrayProductos.map((prod) => prod.id)) + 1;
    }
  }

  async addProduct({ title, description, price, img, code, stock }) {
    const arrayProductos = await this.leerArchivo();

    // Validamos que se hayan completado todos los campos requeridos
    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    // Validamos que el código sea único
    if (arrayProductos.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
    }

    // Creamos el nuevo producto con el id autogenerado
    const nuevoProducto = {
      id: productManager.ultId, // Usamos el id actualizado
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    // Agregamos el nuevo producto al array
    arrayProductos.push(nuevoProducto);

    // Guardamos el array de productos actualizado en el archivo
    await this.guardarArchivo(arrayProductos);

    // Actualizamos ultId para el siguiente producto
    productManager.ultId++;

    console.log("Producto agregado:", nuevoProducto);
  }

  async getProducts() {
    const arrayProductos = await this.leerArchivo();
    return arrayProductos;
  }

  async getProductsById(id) {
    const arrayProductos = await this.leerArchivo();
    const producto = arrayProductos.find((item) => item.id === id);
    return producto || "Not found";
  }

  // Método para guardar el array de productos en el archivo
  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  // Método para leer el archivo de productos
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      return JSON.parse(respuesta);
    } catch (error) {
      console.log("Error al leer el archivo");
      await this.guardarArchivo([]); // Si el archivo no existe o hay error, creamos uno vacío
      return [];
    }
  }

  // Método para eliminar un producto
  async deleteProduct(id) {
    try {
      const productos = await this.getProducts(); // Obtenemos todos los productos
      const index = productos.findIndex((prod) => prod.id === id); // Buscamos el producto por id

      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      // Eliminamos el producto del array
      productos.splice(index, 1);

      // Guardamos los productos actualizados en el archivo
      await this.guardarArchivo(productos);
      console.log(`Producto con id ${id} eliminado exitosamente.`);
    } catch (error) {
      throw new Error("Error al eliminar el producto: " + error.message);
    }
  }
}

export default productManager;
