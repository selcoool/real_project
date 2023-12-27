import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


export const loginMiddleWare = (req, res, next) => {

    if(req.headers.access_token){
    const access_token=req.headers.access_token.split(" ")[1]
    // console.log('access_token',access_token)
       jwt.verify(access_token, process.env.JWT_ACCESS_KEY, function (err, user) {
        if (err) {
          return res.status(403).json({ 
            error:1,
            message: "Access token đã sai hoặc không còn thời gian sử dụng" 
          });
        }
    
        next();
       
      });
        
    }else{
        return res.status(404).json('Không có được phân quyền để thao tác này')
    }
   
}



export const adminMiddleWare = (req, res, next) => {
    
    if(req.headers.access_token){
        const userId = req.body.id
        console.log('id',userId)
        const access_token=req.headers.access_token.split(" ")[1]
        console.log('access_token',access_token)
           jwt.verify(access_token, process.env.JWT_ACCESS_KEY, function (err, user) {
            if (err) {
              return res.status(403).json({ 
                error:1,
                message: "Access token đã sai hoặc không còn thời gian sử dụng" 
              });
            }
        //  console.log('user',user)
            // next();

            if (user?.code=='admin' && user?.id == userId) {
                next()
            } else {
                return res.status(404).json('Không có được phân quyền để thao tác này')
            }

           
          });
            
        }else{
            return res.status(404).json('Không có được phân quyền để thao tác này')
        }
   
}



export const userMiddleWare = (req, res, next) => {
    
    if(req.headers.access_token){
        const userId = req.body.id
        const access_token=req.headers.access_token.split(" ")[1]
           jwt.verify(access_token, process.env.JWT_ACCESS_KEY, function (err, user) {
            if (err) {
              return res.status(403).json({ 
                error:1,
                message: "Access token đã sai hoặc không còn thời gian sử dụng" 
              });
            }
        //  console.log('user',user)
        //     // next();

            if ((user?.code=='user' && user?.id == userId) || (user?.code=='admin' && user?.id == userId)) {
                next()
            } else {
                return res.status(404).json('Không có được phân quyền để thao tác này')
            }

           
          });
            
        }else{
            return res.status(404).json('Không có được phân quyền để thao tác này')
        }
   
}