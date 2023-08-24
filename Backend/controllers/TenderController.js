import TenderModel from '../models/Tender.js';
import TenderStatusModel from '../models/TenderStatus.js';
import OrderModel from '../models/Order.js';
import OrderStatusModel from '../models/OrderStatus.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
  try {
    const tenders = await TenderModel.find().exec();

    res.json(tenders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить отклики',
    });
  }
};

export const getByParams = async (req, res) => {
  try {
    const params = JSON.parse(req.params.params);

    const statusDelete = await TenderStatusModel.findOne({ name: 'Удален' });

    if (params.id) {
      const tender = await TenderModel.findOne({
        status: { $ne: statusDelete._id },
        _id: params.id,
      })
        .populate('order')
        .populate('status')
        .populate('user')
        .exec();

      const user = await UserModel.findOne({ _id: tender?.order.user });
      tender.order.user = user;

      if (tender.user._id != req.userId) {
        return res.status(404).json({
          message: 'Ошибка доступа',
        });
      }

      return res.json(tender);
    } else if (params.user) {
      if (params.user != req.userId) {
        return res.status(404).json({
          message: 'Ошибка доступа',
        });
      }

      const tenders = await TenderModel.find({
        status: { $ne: statusDelete._id },
        user: req.userId,
      })
        .populate('order')
        .populate('status')
        .populate('user')
        .exec();

      return res.json(tenders);
    } else if (params.order) {
      const order = await OrderModel.findOne({ _id: params.order });

      if (order.user != req.userId) {
        TenderModel.find({
          status: { $ne: statusDelete._id },
          order: order,
        })
          .then(async (doc) => {
            if (!doc) {
              return res.status(404).json({
                message: 'Отклики не найдены',
              });
            }

            return res.json({ tendersCount: doc.length });
          })
          .catch((err) => {
            console.log(err);
            return res.status(501).json({
              message: 'Не удалось получить отклики',
            });
          });
      } else {
        TenderModel.find({
          status: { $ne: statusDelete._id },
          order: order,
        })
          .populate('order')
          .populate('status')
          .populate('user')
          .exec()
          .then((doc) => {
            if (!doc) {
              return res.status(404).json({
                message: 'Отклики не найдены',
              });
            }

            return res.json(doc);
          })
          .catch((err) => {
            console.log(err);
            return res.status(501).json({
              message: 'Не удалось получить отклики',
            });
          });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось получить отклики',
    });
  }
};

export const create = async (req, res) => {
  try {
    const statusCreate = await TenderStatusModel.findOne({ name: 'Создан' });
    const statusDelete = await TenderStatusModel.findOne({ name: 'Удален' });

    const order = await OrderModel.findOne({ _id: req.body.order })
      .populate('status')
      .exec();
    if (order.user == req.userId) {
      res.json({
        message: 'Невозможно создать отклик на свой заказ',
      });
      return;
    }

    if (order.status.name !== 'Создан') {
      return res.status(404).json({
        message: 'Можно создать отклик только на заказ со статусом "Создан"',
      });
    }

    const userTenders = await TenderModel.find({
      status: statusCreate._id,
      user: req.userId,
    });
    if (userTenders.length >= 10) {
      res.json({
        message: 'Невозможно создать более 10 откликов',
      });
      return;
    }

    const userOrderTender = await TenderModel.find({
      status: { $ne: statusDelete._id },
      user: req.userId,
      order: order,
    });

    if (userOrderTender.length != 0) {
      res.json({
        message: 'Отклик уже создан',
      });
      return;
    }

    if (req.body.price > order.price) {
      return res.status(500).json({
        message: 'Стоимость не может быть выше стоимости заказа',
      });
    }

    let dateStamp = new Date(order.dateRequire) - new Date();
    let days = dateStamp / (1000 * 60 * 60 * 24);
    days = days <= 0 ? 0 : days < 1 ? 1 : days;

    if (req.body.dateRequire > days) {
      return res.status(500).json({
        message: 'Срок выполнения не может быть больше срока заказа',
      });
    }

    const doc = new TenderModel({
      user: req.userId,
      order: order,
      status: statusCreate,
      description: req.body.description,
      price: req.body.price,
      dateRequire: req.body.dateRequire,
    });

    const tender = await doc.save();
    res.json(tender);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось создать отклик',
    });
  }
};

export const update = async (req, res) => {
  try {
    const tenderId = req.params.id;

    const tender = await TenderModel.findOne({ _id: tenderId });
    if (tender.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    TenderModel.findOneAndUpdate(
      {
        _id: tenderId,
      },
      {
        user: req.userId,
        description: req.body.description,
        price: req.body.price,
        dateRequire: req.body.dateRequire,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Отклик не найден',
          });
        }

        return res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(501).json({
          message: 'Не удалось получить отклик',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось обновить отклик',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const tenderId = req.params.id;

    const tender = await TenderModel.findOne({ _id: tenderId })
      .populate('status')
      .exec();

    const statusDelete = await TenderStatusModel.findOne({ name: 'Удален' });

    if (tender.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    if (tender.status.name === 'Назначен') {
      return res.status(404).json({
        message: 'Невозможно удалить отклик, назначенный на заказ',
      });
    }
    if (tender.status.name === 'Выполнен') {
      return res.status(404).json({
        message: 'Невозможно удалить выполненный отклик',
      });
    }

    TenderModel.findOneAndUpdate(
      {
        _id: tenderId,
      },
      {
        status: statusDelete,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Заказ не отклик',
          });
        }

        return res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось удалить отклик',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось удалить отклик',
    });
  }
};

export const accept = async (req, res) => {
  try {
    const tenderId = req.params.id;

    const acceptStatus = await TenderStatusModel.findOne({ name: 'Назначен' });
    const deleteStatus = await TenderStatusModel.findOne({ name: 'Удален' });
    const orderAcceptStatus = await OrderStatusModel.findOne({ name: 'Назначен' });

    const tender = await TenderModel.findOne({ _id: tenderId })
      .populate('order')
      .populate('status')
      .exec();
    if (tender.order.user != req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const order = await OrderModel.findOne({
      _id: tender.order._id,
    })
      .populate('status')
      .exec();
    if (order.status.name !== 'Создан') {
      return res.status(404).json({
        message: 'Можно назначить только заказ со статусом "Создан"',
      });
    }

    if (tender.status.name == deleteStatus.name) {
      return res.status(404).json({
        message: 'Отклик был удален',
      });
    }

    TenderModel.findOneAndUpdate(
      {
        _id: tenderId,
      },
      {
        status: acceptStatus,
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: 'Отклик не найден',
          });
        }

        const accepted = doc;

        TenderModel.updateMany(
          {
            _id: { $ne: tenderId },
          },
          {
            status: deleteStatus,
          },
        )
          .then(() => {
            OrderModel.findOneAndUpdate(
              {
                _id: tender.order._id,
              },
              {
                status: orderAcceptStatus,
              },
            )
              .then(() => {
                return res.json(accepted);
              })
              .catch((err) => {
                console.log(err);
                return res.status(501).json({
                  message: 'Не удалось обновить статус заказа',
                });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(501).json({
              message: 'Не удалось обновить не выбранные отклики',
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(501).json({
          message: 'Не удалось получить отклик',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выбрать отклик',
    });
  }
};
