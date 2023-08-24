import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не менее 5 символов').isLength({
    min: 5,
    max: 20,
  }),
];

export const loginValidation = [
  body('password', 'Пароль должен быть не менее 5 символов').isLength({
    min: 5,
    max: 20,
  }),
];

export const orderValidation = [
  body('category', 'Неверный формат категории').isString(),
  body('title', 'Название должно быть не менее 6 символов и не более 50 символов')
    .isLength({ min: 6, max: 50 })
    .isString(),
  body(
    'description',
    'Описание должно быть не менее 50 символов и не более 1000 символов',
  ).isLength({
    min: 50,
    max: 1000,
  }),
  body('price', 'Неверный формат стоимости')
    .isNumeric()
    .custom((value) => {
      if (500 <= value && value <= 1000000) {
        return true;
      }
      return Promise.reject(
        'Стоимость должна быть не менее 500р и не более 1000000р',
      );
    }),
  body('dateRequire', 'Неверный формат даты')
    .isNumeric()
    .custom((value) => {
      if (1 <= value && value <= 90) {
        return true;
      }
      return Promise.reject(
        'Срок выполнения должен быть не менее 1 дня и не более 90 дней',
      );
    }),
];

export const tenderValidation = [
  body(
    'description',
    'Сообщение должно быть не менее 50 символов и не более 1000 символов',
  ).isLength({
    min: 50,
    max: 1000,
  }),
  body('price', 'Неверный формат стоимости')
    .isNumeric()
    .custom((value) => {
      if (500 <= value && value <= 1000000) {
        return true;
      }
      return Promise.reject(
        'Стоимость должна быть не менее 500р и не более 1000000р',
      );
    }),
  body('dateRequire', 'Неверный формат даты')
    .isNumeric()
    .custom((value) => {
      if (1 <= value && value <= 90) {
        return true;
      }
      return Promise.reject(
        'Срок выполнения должен быть не менее 1 дня и не более 90 дней',
      );
    }),
];

export const messageValidation = [
  body('chat', 'Неверный идентификатор чата').isString(),
  body('sender', 'Неверный автор сообщения').isString(),
  body(
    'text',
    'Сообщение должно быть не менее 1 символа и не более 1000 символов',
  ).isLength({
    min: 1,
    max: 1000,
  }),
];
