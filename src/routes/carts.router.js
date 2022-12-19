import {Router} from 'express'

const router = Router()


import CartManager from '../cartmanager.js';
const manager = new CartManager('./cart.json');

router.post('/', async (req, res) => {
    const newCart = await manager.addCart()
    res.send({newCart})
})

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid
    const selCart = await manager.getCartById(cartId)
    res.send({selCart})
})

router.get('/', async (req, res) => {
    const carts = await manager.getCarts()
    res.send({carts})
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = parseInt(req.params.pid)
    await manager.addProductById(cartId,productId,1)
    const selCart = await manager.getCartById(cartId)
    res.send({selCart})
})

export default router;