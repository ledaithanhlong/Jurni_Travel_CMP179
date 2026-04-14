import db from '../models/index.js';
import { clearCache } from '../middlewares/cache.js';

const activityMediaInclude = {
  model: db.ActivityMedia,
  as: 'media',
  required: false,
};

export const listActivities = async (req, res, next) => {
  try {
    const rows = await db.Activity.findAll({
      include: [
        activityMediaInclude,
        {
          model: db.Category,
          as: 'categories',
          through: { attributes: [] }
        }
      ],
      order: [
        ['id', 'DESC'],
        [{ model: db.ActivityMedia, as: 'media' }, 'is_thumbnail', 'DESC'],
        [{ model: db.ActivityMedia, as: 'media' }, 'sort_order', 'ASC'],
        [{ model: db.ActivityMedia, as: 'media' }, 'createdAt', 'ASC'],
      ]
    });
    res.json(rows.map(r => r.toJSON()));
  } catch (e) { next(e); }
};

export const createActivity = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { categoryIds, ...data } = req.body;
    const created = await db.Activity.create(data, { transaction });
    
    if (categoryIds && Array.isArray(categoryIds)) {
      await created.setCategories(categoryIds, { transaction });
    }
    
    await transaction.commit();
    clearCache('/activities');
    res.status(201).json(created);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};

export const updateActivity = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { categoryIds, ...data } = req.body;
    const row = await db.Activity.findByPk(req.params.id, { transaction });
    if (!row) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Not found' });
    }
    
    await row.update(data, { transaction });
    
    if (categoryIds && Array.isArray(categoryIds)) {
      await row.setCategories(categoryIds, { transaction });
    }
    
    await transaction.commit();
    clearCache('/activities');
    res.json(row);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const row = await db.Activity.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    await row.destroy();
    clearCache('/activities');
    res.json({ ok: true });
  } catch (e) { next(e); }
};

export const listActivityMedia = async (req, res, next) => {
  try {
    const activity = await db.Activity.findByPk(req.params.activityId);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    const media = await db.ActivityMedia.findAll({
      where: { activity_id: req.params.activityId },
      order: [['is_thumbnail', 'DESC'], ['sort_order', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json(media);
  } catch (e) { next(e); }
};

export const createActivityMedia = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { activityId } = req.params;
    const { type = 'image', url, public_id = null, caption = null, is_thumbnail = false, sort_order } = req.body;

    const activity = await db.Activity.findByPk(activityId, { transaction });
    if (!activity) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (!url) {
      await transaction.rollback();
      return res.status(400).json({ error: 'url is required' });
    }

    if (!['image', 'video'].includes(type)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'type must be image or video' });
    }

    let nextSortOrder = Number(sort_order);
    if (!Number.isInteger(nextSortOrder)) {
      const maxSortOrder = await db.ActivityMedia.max('sort_order', {
        where: { activity_id: activityId },
        transaction
      });
      nextSortOrder = Number.isFinite(maxSortOrder) ? maxSortOrder + 1 : 0;
    }

    if (is_thumbnail) {
      await db.ActivityMedia.update(
        { is_thumbnail: false },
        { where: { activity_id: activityId }, transaction }
      );
    }

    const created = await db.ActivityMedia.create({
      activity_id: activityId,
      type,
      url,
      public_id,
      caption,
      is_thumbnail: Boolean(is_thumbnail),
      sort_order: nextSortOrder
    }, { transaction });

    await transaction.commit();
    clearCache(`/activities/${activityId}/media`);
    res.status(201).json(created);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};

export const updateActivityMedia = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { activityId, mediaId } = req.params;
    const item = await db.ActivityMedia.findOne({
      where: { id: mediaId, activity_id: activityId },
      transaction
    });

    if (!item) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Media not found' });
    }

    const prevUrl = item.url;
    const prevPublicId = item.public_id;

    const data = {};
    const allowedFields = ['type', 'url', 'public_id', 'caption', 'is_thumbnail', 'sort_order'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    if (data.type && !['image', 'video'].includes(data.type)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'type must be image or video' });
    }

    if (data.is_thumbnail === true) {
      await db.ActivityMedia.update(
        { is_thumbnail: false },
        { where: { activity_id: activityId }, transaction }
      );
    }

    await item.update(data, { transaction });
    await transaction.commit();

    if (data.url && String(data.url) !== String(prevUrl)) {
      try {
        await db.MediaAsset.update(
          {
            url: String(data.url),
            public_id: data.public_id !== undefined ? (data.public_id ? String(data.public_id) : null) : (prevPublicId ? String(prevPublicId) : null),
          },
          {
            where: {
              category: 'activity',
              entity_type: 'activity',
              entity_id: Number(activityId),
              url: String(prevUrl),
            }
          }
        );
      } catch {
      }
    }

    clearCache(`/activities/${activityId}/media`);
    res.json(item);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};

export const deleteActivityMedia = async (req, res, next) => {
  try {
    const { activityId, mediaId } = req.params;
    const item = await db.ActivityMedia.findOne({
      where: { id: mediaId, activity_id: activityId }
    });

    if (!item) return res.status(404).json({ error: 'Media not found' });

    const url = item.url;
    await item.destroy();
    try {
      await db.MediaAsset.destroy({
        where: {
          category: 'activity',
          entity_type: 'activity',
          entity_id: Number(activityId),
          url: String(url),
        }
      });
    } catch {
    }
    clearCache(`/activities/${activityId}/media`);
    res.json({ ok: true });
  } catch (e) { next(e); }
};

export const reorderActivityMedia = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { activityId } = req.params;
    const media = Array.isArray(req.body.media) ? req.body.media : null;

    if (!media || media.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'media array is required' });
    }

    const existing = await db.ActivityMedia.findAll({
      where: { activity_id: activityId },
      transaction
    });
    const existingIds = new Set(existing.map((item) => item.id));

    for (const item of media) {
      if (!existingIds.has(item.id)) {
        await transaction.rollback();
        return res.status(400).json({ error: `Invalid media id: ${item.id}` });
      }
    }

    await Promise.all(
      media.map((item, index) => db.ActivityMedia.update(
        { sort_order: Number.isInteger(item.sort_order) ? item.sort_order : index },
        { where: { id: item.id, activity_id: activityId }, transaction }
      ))
    );

    const updated = await db.ActivityMedia.findAll({
      where: { activity_id: activityId },
      order: [['is_thumbnail', 'DESC'], ['sort_order', 'ASC'], ['createdAt', 'ASC']],
      transaction
    });

    await transaction.commit();
    clearCache(`/activities/${activityId}/media`);
    res.json(updated);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};

export const setActivityMediaThumbnail = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { activityId, mediaId } = req.params;
    const item = await db.ActivityMedia.findOne({
      where: { id: mediaId, activity_id: activityId },
      transaction
    });

    if (!item) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Media not found' });
    }

    await db.ActivityMedia.update(
      { is_thumbnail: false },
      { where: { activity_id: activityId }, transaction }
    );

    await item.update({ is_thumbnail: true }, { transaction });
    await transaction.commit();
    clearCache(`/activities/${activityId}/media`);
    res.json(item);
  } catch (e) {
    await transaction.rollback();
    next(e);
  }
};
