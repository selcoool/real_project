import express from "express";
// import uploadCloud from '../upload/uploader.js';
import { upload, cloudinary } from '../upload_function/multerCloudinary.js';
const router = express.Router()
import {loginMiddleWare,adminMiddleWare,userMiddleWare} from "../middlewares/authMiddleware.js"

// import { getUser,createUser,updateUser,deleteUser } from "../controllers/UserController.js";


import * as UserController from "../controllers/UserController.js";




router.post('/',upload.array('avartar'), UserController.createUser)
router.get('/',userMiddleWare,UserController.getOneUser)
router.get('/all',adminMiddleWare,UserController.getAllUsers)
router.post('/login', UserController.loginUser)
router.post('/logout', UserController.logoutUser)
router.post('/refresh_token', UserController.requestRefreshToken)

router.delete('/',userMiddleWare,UserController.deleteUser)
router.put('/',userMiddleWare,upload.array('avartar'),UserController.updateUser)


// router.post('/',uploadCloud.single('avartar'), UserController.createUser)

// router.post('/',upload.single('avartar'), UserController.createUser)
// router.get('/',UserController.getUsers)

// router.put('/update/:_id',authUserMiddleWare, UserController.updateUser)

// router.delete('/delete/:_id',authUserMiddleWare,UserController.deleteUser)



// router.get('/getdetail/:_id', UserController.getDetailUser)

// router.post('/login', UserController.loginUser)

// router.post('/refresh', UserController.requestRefreshToken)

// router.post('/logout', UserController.logoutUser)
export default router;