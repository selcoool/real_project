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
        const fileData=req.files;


        // console.log('fileData',fileData);
        // console.log('fileData.length',fileData.length);

        
        if(fileData && fileData.length>0){


            const hash = bcrypt.hashSync(body?.password, 10)
            const [user, created] = await db.User.findOrCreate({
                where:{username:body?.username},
                defaults:{
                    ...body,
                    password:hash
   
                },
                raw:true,nest:true
            })


          if(created){

            const access_token = created ? jwt.sign({
            id:user.id,
            username:user.username,
            email:user.email,
            code:user.role
            },process.env.JWT_SECRET,{expiresIn:'5d'}) :null;

         
          const userId=user.id
            
            for (let i = 0; i < fileData.length; i++) {

                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder: 'file_uploads' },
                    async(error, result) => {
                      if (error) {
                        // console.error('Error uploading file:', error);
                        res.status(500).json({ 'error': 'Lỗi tải file' });
                      } else {
                        const fileUrl = result.secure_url;
                        const publicId = result.public_id;

                        const imageData ={
                            userId:userId,
                            public_id:result.public_id,
                            url:result.secure_url
                            
                        };

                        const createdImage = await db.Image.create(imageData);

                        // console.log('imageData',imageData);
                        // console.log('createdImage',createdImage);

                        }
                    }
                );
            
                const bufferStream = new Readable();
                bufferStream.push(fileData[i].buffer);
                bufferStream.push(null);
                bufferStream.pipe(uploadStream);
      
            }


            resolve({
                error:created ? 0 : 1,
                message:created ? 'Chúc mừng bạn đã tạo tài khoản thành công' : 'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                access_token: access_token ? `Bearer ${access_token}` :null
            
                })



         } 
            reject({
                error:1, 
                message:'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                access_token: null
            
            }) 

           
            

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

                if(created){
                     const access_token = created ? jwt.sign({
                        id:user.id,
                        username:user.username,
                        email:user.email,
                        code:user.role
                        },process.env.JWT_SECRET,{expiresIn:'5d'}) :null;


                        resolve({
                            error:created ? 0 : 1,
                            message:created ? 'Chúc mừng bạn đã tạo tài khoản thành công' : 'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                            access_token: access_token ? `Bearer ${access_token}` :null
                        
                        })

                }

                reject({
                    error:1, 
                    message:'Tạo tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                    access_token: null
                
                }) 
                         
    
            }


       
    } catch (error) {
         reject({
            error:1, 
            message:error
        
        })
    }
})


export const getOneUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {

       

        const userId =req.body.id;
        console.log('userId',userId);


        //  const response = await db.User.findByPk(id, {
        //     include: {
        //       model: db.Image,
        //       as: 'images', // Make sure 'images' matches the alias you defined in the association
        //     },
        //   });



          const response = await db.User.findOne({
            where:{id:userId},
            include: {
              model: db.Image,
              as: 'images' // Make sure 'images' matches the alias you defined in the association
            },
          });


    

          resolve({
            error:response ? 0 : 1, 
            message:response ? 'Lấy thông tin người dùng thành công' : 'Không thể lấy thông tin người dùng',
            userData:response
        })
        

       
    } catch (error) {
         reject({
            error:1, 
            message:error
        
        })
    }
})






export const getAllUsers = (req, res) => new Promise(async (resolve, reject) => {
    try {

        const {page,limit,...query}=req.query
        const queries ={raw:true, nest:true}
        const offset =(!page || +page <=1)? 0 : (+page-1)
        const flimit = +limit || +process.env.LIMIT_BOOK
        queries.offset = offset * flimit
        queries.limit=flimit
// if(order) queries.order=[order]
// if(name) query.id={ [Op.substring]:id}
     

        // const ids = {id:2,username:'Minh Thành'}; // Assuming the user ID is in the request parameters
        // const offsetAndLimit ={...queries}
         
        const response = await db.User.findAndCountAll({
          where: [query],
          offset:queries.offset,
          limit: queries.limit,
         include: [
            {
              model: db.Image,
              as: 'images',
            },
            
          ],

        });


        resolve({
            error:response ? 0 : 1, 
            message:response ? 'Lấy thông tin người dùng thành công' : 'Không thể lấy thông tin người dùng',
            userData:response
        })



    } catch (error) {
      console.error(error);
  
      reject({
        error: 1,
        message: 'An error occurred while fetching users.',
      });
    }
  });
  
 

  
  











// export const getUsers =({page,limit,order,name,productPrice,...query})=>new Promise(async(resolve, reject)=>{

// const queries ={raw:true, nest:true}
// const offset =(!page || +page <=1)? 0 : (+page-1)
// const flimit = +limit || +process.env.LIMIT_BOOK
// queries.offset = offset * flimit
// queries.limit=flimit
// if(order) queries.order=[order]
// if(name) query.username={ [Op.substring]:name}

//         // if(productPrice) query.productPrice={ [Op.between]:productPrice}


        
//         const response = await db.User.findAndCountAll({
//             where:query,
//             ...queries
           
//           })


//         resolve({
//             'error':response ? 0 : 1, 
//             'message':response ? 'Lấy thông tin người dùng thành công' : 'Không thể lấy thông tin người dùng',
//             'userData':response
//         })

       
       
//     } catch (error) {
//          reject({
//             'error':1, 
//             'message':error
        
//         })
//     }
// })


export const deleteUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {

        const body=req.body;

     
        const id=req.body.id;
        // console.log('id',id);


         const response = await db.User.destroy({
            where:{id:id}
            })


        if(response){

        const response2 = await db.Image.findAll({
            where: {
              userId: id
            },
        });

// Dung map cung duoc
        for(let i=0; i<response2.length;i++){

           const public_id= response2[i]['public_id'];
           const result = await cloudinary.uploader.destroy(public_id);

           const result2 = await db.Image.destroy({
            where:{public_id:public_id}
            })


        }


        resolve({
            'error':response > 0 ? 0 : 1, 
            'message':response > 0 ?  `${response} đã xóa thành công` : 'Thông tin người dùng cần xóa không hợp lệ',
        
             })



     }

     reject({
        error:1, 
        message:'Thông tin người dùng cần xóa không hợp lệ',

    
    })


      
    } catch (error) {
         reject({
            error:1, 
            message:error
        
        })
      
    }
})


export const updateUser =(req,res)=>new Promise(async(resolve, reject)=>{
    try {

   const dataBody=req.body
   const id=req.body.id
   const fileData=req.files;

                    if(fileData && fileData.length>0){

                        const [updated]= await db.User.update({...dataBody }, {
                            where: {
                              id: id,
                            },
                          });


                        // console.log('response',response.length)
                                if(updated){
                                   
                                    const response = await db.Image.findAll({
                                        where: {
                                        userId: id
                                        },
                                    });


                                    for (let i = 0; i < response.length; i++) {
                                        // const id=response[i].id;
                                        const public_id=response[i].public_id;
                                        //   Delete the existing image
                                        await cloudinary.uploader.destroy(public_id);
                                        await db.Image.destroy({
                                            where:{public_id:public_id}
                                            })


                                            // await db.Image.destroy({
                                            //     where:{id:id}
                                            //     })


                                    }

                                
                                    for (let y = 0; y < fileData.length; y++) {

                                        const uploadStream = cloudinary.uploader.upload_stream(
                                            { resource_type: 'auto', folder: 'file_uploads' },
                                            async(error, result) => {
                                            if (error) {
                                                // console.error('Error uploading file:', error);
                                                res.status(500).json({ 'error': 'Lỗi tải file' });
                                            } else {
                                                const fileUrl = result.secure_url;
                                                const publicId = result.public_id;

                                                const imageData ={
                                                    userId:id,
                                                    public_id:publicId,
                                                    url:fileUrl
                                                    
                                                };

                                                 await db.Image.create(imageData);

                                                // console.log('imageData',imageData);
                                                // console.log('createdImage',createdImage);

                                                }
                                            }
                                        );
                                    
                                        const bufferStream = new Readable();
                                        bufferStream.push(fileData[y].buffer);
                                        bufferStream.push(null);
                                        bufferStream.pipe(uploadStream);

                                    }


                                    resolve({
                                        error:updated ? 0 : 1,
                                        message:updated ? 'Chúc mừng bạn đã cập nhật tài khoản thành công' : 'Cập nhật tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                                    
                                    
                                        })



                                } 
                        reject({
                            error:1, 
                            message:'Cập nhật tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                          
                        
                        }) 

                    
                        

                    }else{


                        const [updated]= await db.User.update({...dataBody }, {
                            where: {
                              id: id,
                            },
                          });

                          if(updated){
                            resolve({
                                error:updated ? 0 : 1,
                                message:updated ? 'Chúc mừng bạn đã cập nhật tài khoản thành công' : 'Cập nhật tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                            
                            
                                })
                          }
                          reject({
                            error:1, 
                            message:'Cập nhật tài khoản thất bại, có thể tên người đã được tạo, vui lòng kiểm tra lại',
                          
                        
                        }) 
                          


                    }

       
    } catch (error) {
         reject({
            'error':1, 
            'message':error
        
        })
    
    }
})







// export const updateUser =(req,res)=>new Promise(async(resolve, reject)=>{
//     try {

//    const dataBody=req.body
//    const id=req.body.id
//    const fileData=req.file


//    if(fileData){

//                         const project = await db.User.findOne({ where: { id: id }});
//                         const public_id=project.public_id
                        
                        
//                         console.log('project',public_id)
                        

//                         // Delete the existing image
//                         await cloudinary.uploader.destroy(public_id);


//                         const uploadStream = cloudinary.uploader.upload_stream(
//                             { resource_type: 'auto', folder: 'file_uploads' },
//                             async(error, result) => {
//                             if (error) {
//                                 // console.error('Error uploading file:', error);
//                                 res.status(500).json({ 'error': 'Lỗi tải file' });
//                             } else {
//                                 const fileUrl = result.secure_url;
//                                 const publicId = result.public_id;
//                                 // console.log('result', result);
//                                 // res.json({ fileUrl, publicId });
//                                 const body ={...dataBody,avartar:fileUrl,public_id:publicId}

//                                 const response = await db.User.update(body,{
//                                     where:{id}
//                                     })
                            
                            
                            
//                                 resolve({
//                                     'error':response[0]>0 ? 0 : 1, 
//                                     'message':response[0]>0 ? 'Thông tin đã được cập nhật thành công' : 'Thông tin cập nhật không đúng',
                            
//                                 })
                            
                            

                                        



//                             }
//                             }
//                         );
                    
//                         const bufferStream = new Readable();
//                         bufferStream.push(req.file.buffer);
//                         bufferStream.push(null);
//                         bufferStream.pipe(uploadStream);
                        



    

//    }else{

//                     const response = await db.User.update(body,{
//                         where:{id}
//                         })



//                     resolve({
//                         'error':response[0]>0 ? 0 : 1, 
//                         'message':response[0]>0 ? 'Thông tin đã được cập nhật thành công' : 'Thông tin cập nhật không đúng',

//                     })


//    }

        
    
  

       
       
//     } catch (error) {
//          reject({
//             'error':1, 
//             'message':error
        
//         })
    
//     }
// })

   



  

    
