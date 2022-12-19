import CartManager from './cartmanager.js';

async function run(){

    const carroControlador = new CartManager("cart.json")
    console.table(await carroControlador.getCarts())
    console.table(await carroControlador.addProductById(3,2,5))
    console.table(await carroControlador.getCarts())

}

run()