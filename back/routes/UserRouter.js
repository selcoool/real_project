import express from "express";
// import uploadCloud from '../upload/uploader.js';
import { upload, cloudinary } from '../upload_function/multerCloudinary.js';
const router = express.Router()
// import {authAdminMiddleWare,authUserMiddleWare,verifyMiddleWare} from "../middlewares/authMiddleware.js"

// import { getUser,createUser,updateUser,deleteUser } from "../controllers/UserController.js";


import * as UserController from "../controllers/UserController.js";



// In ra console để kiểm tra thông tin của req.file

//   if (req.file) {
//     const fileUrl = req.file.path; // Đối với Cloudinary, path chứa URL của file
//     res.json({ url: fileUrl });
//   } else {
//     res.status(400).json({ error: 'No file uploaded' });


// router.post('/',uploadCloud.single('avartar'), UserController.createUser)

router.post('/',upload.single('avartar'), UserController.createUser)
router.get('/',UserController.getUsers)
router.delete('/',UserController.deleteUser)
router.put('/',upload.single('avartar'),UserController.updateUser)

// router.put('/update/:_id',authUserMiddleWare, UserController.updateUser)

// router.delete('/delete/:_id',authUserMiddleWare,UserController.deleteUser)



// router.get('/getdetail/:_id', UserController.getDetailUser)

// router.post('/login', UserController.loginUser)

// router.post('/refresh', UserController.requestRefreshToken)

// router.post('/logout', UserController.logoutUser)
export default router;