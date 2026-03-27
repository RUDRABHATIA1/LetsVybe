import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {upload} from '../middleware/multer.js'
import { uploadloop, like, getAllLoops, comment } from '../controllers/loop.controllers.js';

const loopRouter = express.Router();

loopRouter.post('/upload', isAuth, upload.single("media") ,uploadloop)
loopRouter.get('/getAll', isAuth, getAllLoops)
loopRouter.get('/like/:loopId', isAuth, like)
loopRouter.post('/like/:loopId', isAuth, like)
loopRouter.post('/comment/:loopId', isAuth, comment)



export default loopRouter 