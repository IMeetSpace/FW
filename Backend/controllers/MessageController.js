import ChatModel from '../models/Chat.js';
import MessageModel from '../models/Message.js';

export const getByChatId = async (req, res) => {
  try {
    const chat = await ChatModel.findById({ _id: req.params.chatId });
    if (chat.members.filter((member) => member._id == req.userId).length === 0) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const messages = await MessageModel.find({
      chat: req.params.chatId,
    })
      .populate('sender')
      .exec();

    return res.json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось получить список сообщений',
    });
  }
};

export const create = async (req, res) => {
  try {
    const chat = await ChatModel.findById({ _id: req.body.chat });

    if (chat.members.filter((member) => member._id == req.userId).length === 0) {
      return res.status(404).json({
        message: 'Ошибка доступа',
      });
    }

    const doc = new MessageModel({
      chat: req.body.chat,
      sender: req.body.sender,
      text: req.body.text,
    });

    const message = await doc.save();
    message.chat = chat;
    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось отправить сообщение',
    });
  }
};
