import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {upload} from '../middleware/multer.js'
import { getAllStories, getStoryByUsername, uploadStory, viewStory } from '../controllers/story.controllers.js';

const storyRouter = express.Router();

storyRouter.post('/upload', isAuth, upload.single("media") ,uploadStory)
storyRouter.get('/getByUsername/:username', isAuth, getStoryByUsername)
storyRouter.get('/getAll', isAuth, getAllStories)
storyRouter.get('/view/:storyId', isAuth, viewStory)

export default storyRouter