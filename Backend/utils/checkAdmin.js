import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export default async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'hash1234');

      req.userId = decoded._id;

      const user = await UserModel.findOne({ _id: decoded._id })
        .populate('role')
        .exec();

      if (user.role.name == 'admin') {
        next();
      } else {
        return res.status(403).json({
          message: 'Нет доступа',
        });
      }
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
