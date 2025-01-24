import { error } from "console";
import { promises as fs } from "fs";


class CartManager {
    constructor(path) {
            this.carts = [];
            this.path = path;
            this.ultiId = 0;

        //cargar los carritos almacenados
        this.cargarCarritos();
    }

    async cargarCarritos(){
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if(this.carts.length > 0 ) {
                //verificamos que hay por lo menos uun carrito creado
                this.ultiId = Math.max(...this.carts.map(cart => cart.id));
                //se utiliza el metodo map para crear un nnuevo array que solo tenga los ids del carrito y con Math.max
            }
        } catch (error) {
            //si no existe el archivo lo creo 
            await this.guardarCarritos();
        }
    }


    async guardarCarritos(){
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2 ));
    }




    //metodos que me piden las consignas 

    async crearCarrito(){
        const nuevoCarrito = {
            id: ++this.ultiId,
            products: []
        }


        this.carts.push(nuevoCarrito);

        //guardamos arraay en archivo

        await this.guardarCarritos();
        return nuevoCarrito;

    }



    async getCarritoByid(cartId){
        const carrito = this.carts.find(c => c.id === cartId);

        if(!carrito){
            throw new Error("No existe un carrito con ese id");
        }

        return carrito;
        //aca tambien se puede usar un try catch.
    }


    async agregarProductosAlCarrito(cartId, productId, quantity = 1){
        const carrito = await this.getCarritoByid(cartId);
        if(!carrito){
            throw new Error (`No se encontro el carrito con el id ${cartId}`)
        }

        if(!carrito.products){
            throw new Error (`El carrito con id ${cartId} no tiene lista de productos`);
        }

        //verificamos si el producto ya existe en el carrito:
        const existeProducto = carrito.products.find(p => p.product === productId);

        //si el producto ya esta agregado al carrito la agrego cantidad y sino lo pusheo
        if(existeProducto){
            existeProducto.quantity += quantity;
        }else{
            carrito.products.push({product: productId, quantity});
        }


        await this.guardarCarritos();
        return carrito;

        
    }
}


export default CartManager;