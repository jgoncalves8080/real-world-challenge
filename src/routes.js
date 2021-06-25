import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import TagController from './app/controllers/TagController';
import CommentController from './app/controllers/CommentController';
import ArticleController from './app/controllers/ArticleController';

import authMiddlewar from './app/middlewars/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/users/login', SessionController.store);

routes.get('/files', FileController.index);

routes.use(authMiddlewar);

routes.put('/user', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/articles/:articleId/tags', TagController.store);

routes.get('/tags', TagController.index);

routes.post('/articles/:slug/comments', CommentController.store);

routes.get('/comments', CommentController.index);

routes.get('/:commentId/comments', CommentController.index);

routes.post('/author/:authorId/articles', ArticleController.store);

routes.get('/articles', ArticleController.index);

export default routes;
