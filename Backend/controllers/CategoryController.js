import CategoryModel from '../models/Category.js';

export const getAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    const names = categories.map((c) => c.name);

    res.json(names);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить категории',
    });
  }
};
