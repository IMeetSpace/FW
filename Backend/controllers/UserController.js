import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import UserModel from '../models/User.js';
import RoleModel from '../models/Role.js';

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const nickname = req.body.nickname || req.body.email.split('@')[0];

    const role = await RoleModel.findOne({ name: 'user' });
    const doc = new UserModel({
      isActive: true,
      role: role,
      email: req.body.email,
      password: passwordHash,
      nickname: nickname,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'hash1234',
      {
        expiresIn: '30d',
      },
    );

    const { password, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ nickname: req.body.login });

    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.password,
    );
    if (!isValidPassword) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'hash1234',
      {
        expiresIn: '30d',
      },
    );

    const { password, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { password, ...userData } = user._doc;
    res.json({ userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
