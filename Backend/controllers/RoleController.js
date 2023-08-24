import RoleModel from '../models/Role.js';

export const getAll = async (req, res) => {
  try {
    const roles = await RoleModel.find();

    const names = roles.map((c) => c.name);

    res.json(names);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить роли',
    });
  }
};
