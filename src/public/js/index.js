const socket = io();

socket.on("productos", (data) => {
  renderProductos(data);
});

//Renderizar productos:

const renderProductos = (productos) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((item) => {
    const card = document.createElement("div");

    card.innerHTML = `
                         <p> ${item.title} </p>
                         <p> ${item.price} </p>
                         <p> ${item.description} </p>
                         <button> Eliminar </button>
                         `;
    //agregamos vida a boton eliminar
    card.querySelector("button").addEventListener("click", () => {
        eliminarProducto(item.id);
      });
  
      contenedorProductos.appendChild(card);
    });
  };
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}




//agregar productos desde formulario

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})


const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("descripcion").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    }

    socket.emit("agregarProducto", producto);
}
