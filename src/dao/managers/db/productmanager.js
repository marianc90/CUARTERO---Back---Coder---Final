import productsModel from '../../models/products.model.js'

class ProductManager{

    
    getProducts = async () => {
        try{
            let content=await productsModel.find().lean().exec();
            return content
        }
        catch(err){
            return "Can't reach products"
        }
        
    } 
    
    async addProduct(title,description,price,code,stock, category, status = true, thumbnails = []){
        const newProduct= this.#newProduct(title,description,price,code,stock, category, status, thumbnails)
        console.log(newProduct);
        const errors = await this.#errorCheck(newProduct,"add")
        console.log(errors);
        return errors.length == 0 ? (await productsModel.create(newProduct),newProduct) : {error: errors}
        
    }

    getProductById = async (id) => {
            if (id.length == 24){
              return await productsModel.findOne({_id:id}) || "Product Id not found";  
            } else {
                return 'ID must be 24 characters'
            }
        }    
        
    updateProductById = async (id,title,description,price,code,stock, category, status = true, thumbnails = []) => {
        if (id.length != 24) return {error: "ID must be 24 characters"} 
        const updatedProduct= this.#newProduct(title,description,price,code,stock, category, status, thumbnails)
        const errors = await this.#errorCheck(updatedProduct, "update")
        if (!await productsModel.findOne({_id:id})) errors.push("Product Id not found")
        return errors.length == 0 ? (await productsModel.updateOne({_id:id},updatedProduct),updatedProduct) : errors
        
    }   
    
    deleteProductById = async (id) => {
        if (id.length == 24){
            const productToDelete = await productsModel.findOne({_id:id})
        if (productToDelete) return (productToDelete, await productsModel.deleteOne({_id:id}),{message: "Success"})
        else return {error: "Product Id not found"} 
          } else {
              return {error:'ID must be 24 characters'}
          }
        
    }

    #newProduct(title,description,price,code,stock, category, status, thumbnails){
        const newProduct={
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        }
        return newProduct;
    }

    async #errorCheck(newProduct, operation){
        const errors=new Array();
        if (operation == "add") {
            if(await productsModel.findOne({code:newProduct.code}) ) errors.push(`Code "${newProduct.code}" already exists`)
        }
        if (Object.values(newProduct).includes(undefined)) errors.push('There are empty fields.')
        return errors
    }

}

//module.exports = ProductManager;

export default ProductManager;