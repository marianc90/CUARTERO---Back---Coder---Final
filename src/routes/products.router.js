import {Router} from 'express'

const router = Router()


import ProductManager from '../dao/managers/db/productmanager.js';
const manager = new ProductManager();


router.get('/products', async (req, res) => {
    let limit = req.query.limit
    let page = req.query.page
    let query = req.query.query
    let sort = req.query.sort
 
    const products = await manager.getProducts(limit, page, sort, query)
    res.send(products)
    
    req.io.emit('updatedProducts', products);

})

router.get('/products/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await manager.getProductById(id)
    res.send(product)
})

router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const addProduct = await manager.addProduct(title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('updatedProducts', await manager.getProducts());
    res.send(addProduct)

})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateProductById(id, title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('updatedProducts', await manager.getProducts());
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const deleteProduct =  await manager.deleteProductById(id)
    req.io.emit('updatedProducts', await manager.getProducts());
    res.send(deleteProduct)
})

export default router;