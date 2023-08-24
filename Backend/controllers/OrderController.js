import jwt from 'jsonwebtoken';

import OrderModel from '../models/Order.js';
import OrderStatusModel from '../models/OrderStatus.js';
import CategoryModel from '../models/Category.js';
import UserModel from '../models/User.js';
import TenderModel from '../models/Tender.js';
import TenderStatusModel from '../models/TenderStatus.js';

import { getFullDate } from '../utils/getRemainingTime.js';

export const getAll = async (req, res) => {
  try {
    const statusCreate = await OrderStatusModel.findOne({ name: 'Создан' });

    let orders = await OrderModel.find({
      status: statusCreate._id,
      dateRequire: { $gt: new Date() },
    });
    if (!req.headers.authorization) {
      return res.json(orders);
    }

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const decoded = jwt.verify(token, 'hash1234');
    const userId = decoded._id;

    orders = await OrderModel.find({
      status: statusCreate._id,
      user: { $ne: userId },
      dateRequire: { $gt: new Date() },
    });

    const tenderStatusDelete = await TenderStatusModel.findOne({
      name: 'Удален',
    });

    const linkedOrders = await Promise.all(
      orders.map(async (order) => {
        const linkedOrder = { ...order._doc };

        const tender = await TenderModel.findOne({
          user: userId,
          order: order._id,
          status: { $ne: tenderStatusDelete },
        });
        linkedOrder.tender = tender;

        return linkedOrder;
      }),
    );
    return res.json(linkedOrders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить заказы',
    });
  }
};

export const getByParams = async (req, res) => {
  try {
    const token = (req.headers?.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
      try {
        const decoded = jwt.verify(token, 'hash1234');

        req.userId = decoded._id;
      } catch {}
    }

    const params = JSON.parse(req.params.params);
    const statusDelete = await OrderStatusModel.findOne({ name: 'Удален' });

    if (params.user) {
      const user = await UserModel.findOne({ _id: params.user });
      let orders = await OrderModel.find({
        user: user,
        // status: { $ne: statusDelete._id },
      })
        .populate('status')
        .exec();

      res.json(orders);
    }
    if (params.id) {
      let inc = 1;
      if (params.noInc) {
        inc = 0;
      }
      OrderModel.findOneAndUpdate(
        {
          _id: params.id,
          // status: { $ne: statusDelete._id },
        },
        {
          $inc: { views: inc },
        },
        {
          returnDocument: 'afrer',
        },
      )
        .populate('user')
        .populate('status')
        .exec()
        .then((doc) => {
          if (!doc) {
            return res.status(404).json({
              message: 'Заказ не найден',
            });
          }

          if (doc.status.name === 'Удален') {
            if (doc.user._id != req.userId) {
              return res.status(404).json({
                message: 'Заказ не найден',
              });
            }
          }

          return res.json(doc);
        })
        .catch((err) => {
          console.log(err);
          return res.status(501).json({
            message: 'Не удалось получить заказ',
          });
        });
    } else if (params.category) {
      const category = await CategoryModel.findOne({ name: params.category });
      const orders = await OrderModel.find({
        status: status._id,
        category: category,
      }).exec();

      res.json(orders);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось получить заказ',
    });
  }
};

export const create = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ name: req.body.category });
    const statusCreate = await OrderStatusModel.findOne({ name: 'Создан' });

    let dateRequire = new Date();
    dateRequire.setDate(dateRequire.getDate() + Number(req.body.dateRequire));

    const doc = new OrderModel({
      category: category,
      status: statusCreate,
      user: req.userId,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      views: 0,
      dateRequire: getFullDate(dateRequire),
    });

    const order = await doc.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать заказ',
    });
  }
};

export const update = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findOne({ _id: orderId });
    if (order.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const category = await CategoryModel.findOne({ _id: req.body.category });

    OrderModel.findOneAndUpdate(
      {
        _id: orderId,
      },
      {
        category: category,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        dateRequire: req.body.dateRequire,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Заказ не найден',
          });
        }

        return res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(501).json({
          message: 'Не удалось получить заказ',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось обновить заказ',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const orderId = req.params.id;

    const statusDelete = await OrderStatusModel.findOne({ name: 'Удален' });
    const tenderStatusDelete = await TenderStatusModel.findOne({ name: 'Удален' });

    const order = await OrderModel.findOne({ _id: orderId })
      .populate('status')
      .exec();
    if (order.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    if (order.status.name === 'Назначен') {
      return res.status(404).json({
        message: 'Невозможно удалить назначенный заказ',
      });
    }
    if (order.status.name === 'Выполнен') {
      return res.status(404).json({
        message: 'Невозможно удалить выполненный заказ',
      });
    }

    OrderModel.findOneAndUpdate(
      {
        _id: orderId,
      },
      {
        status: statusDelete._id,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Заказ не найден',
          });
        }

        TenderModel.updateMany(
          {
            order: order._id,
          },
          {
            status: tenderStatusDelete,
          },
        )
          .then(() => {
            return res.json(doc);
          })
          .catch((err) => {
            console.log(err);
            return res.status(501).json({
              message: 'Не удалось удалить отклики',
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось удалить заказ',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось удалить заказ',
    });
  }
};

export const accept = async (req, res) => {
  try {
    const orderId = req.params.id;

    const finishStatus = await OrderStatusModel.findOne({ name: 'Выполнен' });
    const tenderAcceptStatus = await TenderStatusModel.findOne({ name: 'Назначен' });
    const tenderFinishStatus = await TenderStatusModel.findOne({ name: 'Выполнен' });

    const order = await OrderModel.findOne({
      _id: orderId,
    })
      .populate('status')
      .exec();
    if (order.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    if (order.status.name !== 'Назначен') {
      return res.status(404).json({
        message: 'Можно отметить выполненным только заказ со статусом "Назначен"',
      });
    }

    OrderModel.findOneAndUpdate(
      {
        _id: orderId,
      },
      {
        status: finishStatus,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Заказ не найден',
          });
        }

        const finished = doc;

        TenderModel.findOneAndUpdate(
          {
            order: order._id,
            status: tenderAcceptStatus,
          },
          {
            status: tenderFinishStatus,
          },
        )
          .then(() => {
            return res.json(finished);
          })
          .catch((err) => {
            console.log(err);
            return res.status(501).json({
              message: 'Не удалось отметить выполненным отклик',
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(501).json({
          message: 'Не удалось отметить выполненным заказ',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось отметить выполненным заказ',
    });
  }
};
