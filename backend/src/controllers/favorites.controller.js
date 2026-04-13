import db from '../models/index.js';

export const addFavorite = async (req, res, next) => {
  try {
    const { service_type, service_id, name, meta, price } = req.body;
    const created = await db.Favorite.create({
      user_id: req.user.id,
      service_type,
      service_id,
      name,
      meta,
      price
    });
    res.status(201).json(created);
  } catch (e) { next(e); }
};

export const listFavorites = async (req, res, next) => {
  try {
    const rows = await db.Favorite.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    res.json(rows);
  } catch (e) { next(e); }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const favorite = await db.Favorite.findOne({ where: { id, user_id: req.user.id } });
    if (!favorite) return res.status(404).json({ error: 'Không tìm thấy mục yêu thích' });
    await favorite.destroy();
    res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (e) { next(e); }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const { serviceType, serviceId } = req.params;
    const favorite = await db.Favorite.findOne({
      where: {
        user_id: req.user.id,
        service_type: serviceType,
        service_id: serviceId
      }
    });
    res.json({ isFavorite: !!favorite, favoriteId: favorite?.id });
  } catch (e) { next(e); }
};


