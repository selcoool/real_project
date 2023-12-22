// import postRouter from './PostRouter.js'
import userRouter from './UserRouter.js'


const routes = (app) => {
   
    // app.use('/posts', postRouter)
    app.use('/users', userRouter)

}

export default routes;