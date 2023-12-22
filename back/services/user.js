import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// const cloudinary = require('cloudinary').v2;


const { Readable } = require('stream');

const { upload, cloudinary } = require('../upload_function/multerCloudinary.js');
const dotenv = require('dotenv');
dotenv.config();
// import dotenv from 'dotenv'
import { Op } from 'sequelize';


export const createNewUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {
        const body=req.body;
        const fileData=req.file;

        if(fileData){


             const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'file_uploads' },
            async(error, result) => {
              if (error) {
                // console.error('Error uploading file:', error);
                res.status(500).json({ 'error': 'Lỗi tải file' });
              } else {
                const fileUrl = result.secure_url;
                const publicId = result.public_id;
                // console.log('result', result);
                // res.json({ fileUrl, publicId });

                        const hash = bcrypt.hashSync(body?.password, 10)
                        const [user, created] = await db.User.findOrCreate({
                            where:{username:body?.username},
                            defaults:{
                                ...body,
                                password:hash,
                                avartar:fileUrl,
                                public_id:publicId

                            },
                            raw:true,nest:true
                        })

                         const access_token = created ? jwt.sign({
                            id:created.id,
                            id:created.username,
                            email:created.email,
                            code:created.role
                            },process.env.JWT_SECRET,{expiresIn:'5d'}) :null;

                        
                        if(!created){
                              // Delete the existing image in case there is any error
                               await cloudinary.uploader.destroy(publicId);
                        }
                    


                        resolve({
                            'error':created ? 0 : 1,
                            'message':created ? 'Chúc mừng bạn đã tạo tài khoản tài công' : 'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                            'access_token': access_token ? `Bearer ${access_token}` :null
                        
                        })





              }
            }
          );
      
          const bufferStream = new Readable();
          bufferStream.push(req.file.buffer);
          bufferStream.push(null);
          bufferStream.pipe(uploadStream);
           




        }else{
            
             const hash = bcrypt.hashSync(body?.password, 10)
              const [user, created] = await db.User.findOrCreate({
                        where:{username:body?.username},
                        defaults:{
                            ...body,
                            password:hash
                        },
                        raw:true,nest:true
                })

                const access_token = created ? jwt.sign({
                    id:created.id,
                    id:created.username,
                    email:created.email,
                    code:created.role
                    },process.env.JWT_SECRET,{expiresIn:'5d'}) :null;

                
            


                resolve({
                    'error':created ? 0 : 1,
                    'message':created ? 'Chúc mừng bạn đã tạo tài khoản tài công' : 'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                    'access_token': access_token ? `Bearer ${access_token}` :null
                
                })

        }

       
    } catch (error) {
         reject({
            'error':1, 
            'message':error
        
        })
    }
})




export const getUsers =({page,limit,order,name,productPrice,...query})=>new Promise(async(resolve, reject)=>{
    try {

        const queries ={raw:true, nest:true}
        const offset =(!page || +page <=1)? 0 : (+page-1)
        const flimit = +limit || +process.env.LIMIT_BOOK
        queries.offset = offset * flimit
        queries.limit=flimit
        if(order) queries.order=[order]
        if(name) query.username={ [Op.substring]:name}

        if(productPrice) query.productPrice={ [Op.between]:productPrice}


        
        const response = await db.User.findAndCountAll({
            where:query,
            ...queries
           
          })


        resolve({
            'error':response ? 0 : 1, 
            'message':response ? 'Lấy thông tin người dùng thành công' : 'Không thể lấy thông tin người dùng',
            'userData':response
        })

       
       
    } catch (error) {
         reject({
            'error':1, 
            'message':error
        
        })
    }
})




export const deleteUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {

        const body=req.body;



        const result = await cloudinary.uploader.destroy(body.public_id);
        
        const response = await db.User.destroy({
            where:{id:body.id}
            })


    resolve({
        'error':response > 0 ? 0 : 1, 
        'message':response > 0 ?  `${response} đã xóa thành công` : 'Thông tin người dùng cần xóa không hợp lệ',
    
    })
  

       
       
    } catch (error) {
         reject({
            'error':1, 
            'message':error
        
        })
      
    }
})




export const updateUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {

   const body=req.body
   const id=req.body.id
   const fileData=req.file
//    const public_id=req.body.public_id


   if(fileData){

                        const project = await db.User.findOne({ where: { id: id }});
                        const public_id=project.public_id
                        
                        
                        console.log('project',public_id)
                        

                        // Delete the existing image
                        await cloudinary.uploader.destroy(public_id);


                        const uploadStream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto', folder: 'file_uploads' },
                            async(error, result) => {
                            if (error) {
                                // console.error('Error uploading file:', error);
                                res.status(500).json({ 'error': 'Lỗi tải file' });
                            } else {
                                const fileUrl = result.secure_url;
                                const publicId = result.public_id;
                                // console.log('result', result);
                                // res.json({ fileUrl, publicId });
                                const body ={...body,avartar:fileUrl,public_id:publicId}
                                const response = await db.User.update(body,{
                                    where:{id}
                                    })
                            
                            
                            
                                resolve({
                                    'error':response[0]>0 ? 0 : 1, 
                                    'message':response[0]>0 ? 'Thông tin đã được cập nhật thành công' : 'Thông tin cập nhật không đúng',
                            
                                })
                            
                            

                                        



                            }
                            }
                        );
                    
                        const bufferStream = new Readable();
                        bufferStream.push(req.file.buffer);
                        bufferStream.push(null);
                        bufferStream.pipe(uploadStream);
                        



    

   }else{

                    const response = await db.User.update(body,{
                        where:{id}
                        })



                    resolve({
                        'error':response[0]>0 ? 0 : 1, 
                        'message':response[0]>0 ? 'Thông tin đã được cập nhật thành công' : 'Thông tin cập nhật không đúng',

                    })


   }

        
    
  

       
       
    } catch (error) {
         reject({
            'error':1, 
            'message':error
        
        })
    
    }
})

   



  

    
