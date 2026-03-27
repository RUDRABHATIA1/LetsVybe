import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from '../controllers/user.controller.js';
import {upload} from '../middleware/multer.js'


const userRouter = express.Router();

userRouter.get('/current', isAuth, getCurrentUser)
userRouter.get('/suggested', isAuth, suggestedUsers)
userRouter.get('/getProfile/:username', isAuth, getProfile)
userRouter.get('/follow/:targetUserId', isAuth, follow)
userRouter.get('/followingList', isAuth, followingList)
userRouter.get('/search', isAuth, search)
userRouter.get('/getAllNotifications', isAuth, getAllNotifications)
userRouter.get('/markAsRead', isAuth, markAsRead)
userRouter.put('/editprofile', isAuth, upload.single("profileImage") ,editProfile)


export default userRouter 