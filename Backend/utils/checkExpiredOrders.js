import OrderModel from '../models/Order.js';
import OrderStatusModel from '../models/OrderStatus.js';

import { getFullDate } from './getRemainingTime.js';

export default async () => {
  const statusCreate = await OrderStatusModel.findOne({ name: 'Создан' });
  const statusExpire = await OrderStatusModel.findOne({ name: 'Истек' });

  const now = new Date();
  let orders = await OrderModel.updateMany(
    {
      status: statusCreate._id,
      dateRequire: { $lt: now },
    },
    {
      status: statusExpire._id,
    },
  );

  const dateString = `${getFullDate(now)} ${now.getHours()}:${now.getMinutes()}`;
  console.log(`INFO | ${dateString} | Истекло заказов: ${orders.matchedCount}`);
};
