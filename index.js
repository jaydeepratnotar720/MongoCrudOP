import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8","1.1.1.1"]);

const MONGO_URI="mongodb+srv://mcauser:ioeQXnIJxKwNBflV@cluster0.3yshvit.mongodb.net/dmartstore";

const app =express();
app.use(express.json());

const PORT=3000;

if(!MONGO_URI){
    console.error("MongoDB URI is not defined. please set the MONGO_URI environment variable.");
    process.exit(1);
}
mongoose.connect(MONGO_URI);

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
});
const Product=mongoose.model("Product",productSchema);

app.get("/products",async (req,res)=>{
    try{
    const products=await Product.find();

    res.status(200).json({message:"get all products", data:products});
}catch(error){
    res.status(500).json({message:"Error fatching products",error});
}  
});

app.post("/products",async (req,res)=>{
    try{
        // const product =new Product(req.body);
        // await product.save();
        const product = await Product.create(req.body);

        res.status(201).json({message:"Product created", data:product});
    }catch(error){
        res.status(400).json({message:"Error creating product",error});
    }
});

app.put("/products/:id",(req,res)=>{
    try{
    const product=Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        });
    res.status(200).json({message:"Product Updated", id:req.params.id,data:product});
    }catch(error){
        res.status(400).json({message:"Error updating product", error});
    }
});

app.delete("/products/:id",(req,res)=>{
    res.json({message:"Product Deleted", id:req.params.id});
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});