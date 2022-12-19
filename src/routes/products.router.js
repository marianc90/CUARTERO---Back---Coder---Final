import {Router} from 'express'

const router = Router()


import ProductManager from '../productmanager.js';
const manager = new ProductManager('./productos.json');


router.get('/products', async (req, res) => {
    const products = await manager.getProducts()
    let limit = req.query.limit
    if (!limit) res.send({products})
    else {
        const prodLimit = [];
        if (limit > products.length) limit = products.length;
        for (let index = 0; index < limit; index++) {
            prodLimit.push(products[index]);
        }
        res.send({prodLimit})
    }
})

router.get('/products/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await manager.getProductById(id)
    res.send({product})
})

router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const addProduct = await manager.addProduct(title, description, price, code, stock, category, status, thumbnails)
    res.send(addProduct)
})

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateProductById(id, title, description, price, code, stock, category, status, thumbnails)
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const deleteProduct =  await manager.deleteProductById(id)
    res.send(deleteProduct)
})

export default router;