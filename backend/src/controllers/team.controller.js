import db from '../models/index.js';

const { TeamMember } = db;

const getAll = async (req, res, next) => {
    try {
        const members = await TeamMember.findAll({ order: [['id', 'ASC']] });
        res.json(members);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const member = await TeamMember.create(req.body);
        res.json(member);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [updated] = await TeamMember.update(req.body, { where: { id } });
        if (updated) {
            const updatedMember = await TeamMember.findByPk(id);
            res.json(updatedMember);
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await TeamMember.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ message: 'Team member not found' });
        }
    } catch (error) {
        next(error);
    }
};

export default {
    getAll,
    create,
    update,
    remove
};
