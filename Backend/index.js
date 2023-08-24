import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

import {
  registerValidation,
  loginValidation,
  orderValidation,
  tenderValidation,
  messageValidation,
} from './validations.js';

import {
  recreateDB,
  checkAuth,
  checkAdmin,
  handleValidationErrors,
  checkExpiredOrders,
} from './utils/index.js';
import {
  ChatController,
  MessageController,
  CategoryController,
  OrderController,
  RoleController,
  TenderController,
  UserController,
} from './controllers/index.js';

//  Database Connection
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log('DB | OK');
  })
  .catch((err) => {
    console.log('DB | ERROR', err);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// recreateDB();

/*  Chat  */
app.get('/dialogs', checkAdmin, ChatController.getAll);
app.get('/dialogs/:userId', checkAuth, ChatController.getByUserId);
app.post('/dialogs', checkAuth, ChatController.create);

/*  Message  */
app.get('/messages/:chatId', checkAuth, MessageController.getByChatId);
app.post(
  '/messages',
  checkAuth,
  messageValidation,
  handleValidationErrors,
  MessageController.create,
);

/*  Categories  */
app.get('/categories', CategoryController.getAll);

/*  Orders  */
app.get('/orders', OrderController.getAll);
app.get('/orders/:params', OrderController.getByParams);
app.post(
  '/orders',
  checkAuth,
  orderValidation,
  handleValidationErrors,
  OrderController.create,
);
app.patch(
  '/orders/:id',
  checkAuth,
  orderValidation,
  handleValidationErrors,
  OrderController.update,
);
app.post('/orders/accept/:id', checkAuth, OrderController.accept);
app.delete('/orders/:id', checkAuth, OrderController.remove);

/*  Roles  */
app.get('/roles', checkAdmin, RoleController.getAll);

/*  Tenders  */
app.get('/tenders', checkAdmin, TenderController.getAll);
app.get('/tenders/:params', checkAuth, TenderController.getByParams);
app.post(
  '/tenders',
  checkAuth,
  tenderValidation,
  handleValidationErrors,
  TenderController.create,
);
app.post('/tenders/accept/:id', checkAuth, TenderController.accept);
/*app.patch(
  '/tenders/:id',
  checkAuth,
  tenderValidation,
  handleValidationErrors,
  TenderController.update,
);*/
app.delete('/tenders/:id', checkAuth, TenderController.remove);

/*  User  */
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register,
);
app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login,
);
app.get('/auth/me', checkAuth, UserController.getMe);

/*  Files */
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('SERVER | ERROR', err);
  }

  setTimeout(() => {
    checkExpiredOrders();
  }, 1000 * 30);
  setInterval(() => {
    checkExpiredOrders();
  }, 1000 * 60 * 60);

  console.log('SERVER | OK');
});
