//to check books sent by client are present
const Book = require('../models/book')
const ress = require('../helper/response-handle')

module.exports = async(req,res,next)=>{
  
      var j=[];
      var b2=[];
      var count=0;

      for(const i in req.body.books){
          //console.log(i)
        try {
            var b1 = await Book.findOne({bookName:req.body.books[i]})
            if (b1===null){
                
             j.push(i);   //push into empty array
                
            }
            else{
               
                b2[count]={
                   id:b1._id,
                   price:b1.price
               }
                //req.i=b2;
                console.log(b2)
                //console.log(req.i)
                                      //Error!!!
            } 
            
        } catch (error) {
            
            return res.status(400).json(ress(false,null,"Bad Request book"))
            
        }

        count=count+1
        

      }
      if(j.length==0){
          req.count=count;
          console.log(req.count)
          req.info=b2;
          next()
      }else{
          console.log("lol")
        res.status(404).json(ress(false,null,j+" Not Found")) 
      }
}



