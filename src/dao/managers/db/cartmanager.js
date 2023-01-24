import cartsModel from '../../models/carts.model.js'

class CartManager{

    getCarts = async () => {
       try {
            let content=await cartsModel.find().lean().exec();
            return content
       } catch (error) {
            return 'Cannot reach carts'
       }
    }
    
    async addCart(){
        try{
            const newCart = await cartsModel.create({products:[]})
            return newCart
        } catch(err){
            return err
        }
        
    }
    
    getCartById = async (id) => {
        const cartById = await cartsModel.findOne({_id:id}).lean().exec()
        return cartById || "Cart Id not found";
        
    }
    
    addProductById = async (cartId,productId,quantity) => {
        const cart = await this.getCartById(cartId) 
        const product = cart.products?.find(product => product.product == productId)
        if (!product) cart.products?.push({product: productId, quantity: quantity})
        else product.quantity += quantity
        return (await cartsModel.updateOne({_id:cartId}, {products:cart.products}),cart)
        
    }

}
//module.exports = ProductManager;

export default CartManager;