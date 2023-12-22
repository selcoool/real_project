import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import routers from './routes/index.js';
import connection_database from './config/connection_database.js';

dotenv.config();
var app = express()
var port=process.env.PORT ||3001


var  corsOptions  = {
  origin:["https://thegioimauxanh.com","http://localhost:3000","https://peaceful-sunflower-941f16.netlify.app"], //frontend url
  credentials: true,
  allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
  exposedHeaders:'Content-Range, X-Content-Range'
}

// Value in corsOptions must be a string ['GET,HEAD,PUT,PATCH,POST,DELETE'], ['GET','HEAD','PUT','PATCH','POST','DELETE'],
// 'GET,HEAD,PUT,PATCH,POST,DELETE'

// Value in origin must be the same domain, it will reject if there is any difference, ex:http://localhost:3000/   (reject due to '/')

// axios must have:  const config = {
//   withCredentials: true,
//    headers: {'Content-Type': 'application/json',}
// };
  
 app.use(cors(corsOptions));




app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));

routers(app)


    console.log('Connected to DB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });


 

