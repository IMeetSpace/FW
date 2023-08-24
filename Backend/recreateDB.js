import UserModel from './models/User.js';
import ChatModel from './models/Chat.js';
import MessageModel from './models/Message.js';
import RoleModel from './models/Role.js';
import CategoryModel from './models/Category.js';
import OrderStatusModel from './models/OrderStatus.js';
import OrderModel from './models/Order.js';
import TenderStatusModel from './models/TenderStatus.js';
import TenderModel from './models/Tender.js';

export default async () => {
  //  Users
  await UserModel.deleteMany();

  //  Chats
  await ChatModel.deleteMany();
  await MessageModel.deleteMany();

  //  Roles
  await RoleModel.deleteMany();
  await RoleModel.insertMany([{ name: 'admin' }, { name: 'user' }]);

  //  Categories
  await CategoryModel.deleteMany();
  await CategoryModel.insertMany([
    {
      isActive: true,
      level: 1,
      name: 'Дизайн',
    },
    {
      isActive: true,
      level: 1,
      name: 'Разработка и IT',
    },
    {
      isActive: true,
      level: 1,
      name: 'Тексты и переводы',
    },
    {
      isActive: true,
      level: 1,
      name: 'SEO и трафик',
    },
    {
      isActive: true,
      level: 1,
      name: 'Соцсети и реклама',
    },
  ]);

  //  Статусы заказа
  await OrderStatusModel.deleteMany();
  await OrderStatusModel.insertMany([
    { name: 'Создан' },
    { name: 'Назначен' },
    { name: 'Выполнен' },
    { name: 'Удален' },
    { name: 'Истек' },
  ]);

  //  Заказы
  await OrderModel.deleteMany();

  // Статусы отклика
  await TenderStatusModel.deleteMany();
  await TenderStatusModel.insertMany([
    { name: 'Создан' },
    { name: 'Назначен' },
    { name: 'Выполнен' },
    { name: 'Удален' },
  ]);

  //  Отклики
  await TenderModel.deleteMany();
};
