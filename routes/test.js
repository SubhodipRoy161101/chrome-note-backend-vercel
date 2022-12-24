const Menu = require("../models/Notes");

function homeController() {
  return {
    async function(req,res){
        try{
            const pizzas=await Menu.find({});
            res.json(pizzas)
            console.log(pizzas);
        }
        catch(error){
            res.status(500).send("Some Error Has Occoured")
        }
    }
  };
}

// const homeController=async (req,res)=>{
//     try{
//         const pizzas=await Menu.find({});
//         res.json(pizzas)
//         console.log(pizzas);
//     }
//     catch(error){
//         res.status(500).send("Some Error Has Occoured")
//     }
// }

module.exports = { homeController };
