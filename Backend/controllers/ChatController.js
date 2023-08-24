import ChatModel from '../models/Chat.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
  try {
    const chats = await ChatModel.find();

    res.json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить список чатов',
    });
  }
};

export const getByUserId = async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const chats = await ChatModel.find({
      members: { $in: [req.params.userId] },
    })
      .populate('members')
      .exec();

    return res.json(chats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось получить список чатов',
    });
  }
};

export const create = async (req, res) => {
  try {
    if (req.body.sender !== req.userId) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const userChats = await ChatModel.findOne({
      members: { $in: [req.body.sender] },
      members: { $in: [req.body.receiver] },
    });

    if (userChats) {
      return res.json(userChats);
    }

    const doc = new ChatModel({
      members: [req.body.sender, req.body.receiver],
    });

    const chat = await doc.save();
    res.json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать чат',
    });
  }
};
