import db from '../models/index.js';

const USER_PUBLIC_SELECT = 'name email role clerkId phone createdAt updatedAt';

function parsePaging(query) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    return { page, limit, skip: (page - 1) * limit };
}

export const listUsers = async (req, res, next) => {
    try {
        const { page, limit, skip } = parsePaging(req.query);
        const { keyword, role } = req.query;

        const filter = {};
        if (role) {
            filter.role = role;
        }
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { email: { $regex: keyword, $options: 'i' } },
                { phone: { $regex: keyword, $options: 'i' } },
            ];
        }

        const [rows, total] = await Promise.all([
            db.User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(USER_PUBLIC_SELECT)
                .lean(),
            db.User.countDocuments(filter),
        ]);

        return res.json({
            success: true,
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const row = await db.User.findById(req.params.id).select(USER_PUBLIC_SELECT).lean();
        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay user',
            });
        }

        return res.json({ success: true, data: row });
    } catch (error) {
        return next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password = null, role = 'user', clerkId = null, phone = null } = req.body || {};

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'name va email la bat buoc',
            });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'role khong hop le',
            });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        const existed = await db.User.findOne({ email: normalizedEmail }).lean();
        if (existed) {
            return res.status(409).json({
                success: false,
                message: 'Email da ton tai',
            });
        }

        const row = await db.User.create({
            name,
            email: normalizedEmail,
            password,
            role,
            clerkId,
            phone,
        });

        return res.status(201).json({
            success: true,
            data: {
                _id: row._id,
                name: row.name,
                email: row.email,
                role: row.role,
                clerkId: row.clerkId,
                phone: row.phone,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const payload = { ...req.body };
        delete payload._id;

        if (payload.email) {
            payload.email = String(payload.email).toLowerCase().trim();
            const duplicated = await db.User.findOne({
                email: payload.email,
                _id: { $ne: req.params.id },
            }).lean();

            if (duplicated) {
                return res.status(409).json({
                    success: false,
                    message: 'Email da ton tai',
                });
            }
        }

        if (payload.role && !['user', 'admin'].includes(payload.role)) {
            return res.status(400).json({
                success: false,
                message: 'role khong hop le',
            });
        }

        const row = await db.User.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true,
        }).select(USER_PUBLIC_SELECT);

        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay user',
            });
        }

        return res.json({ success: true, data: row });
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const row = await db.User.findByIdAndDelete(req.params.id);
        if (!row) {
            return res.status(404).json({
                success: false,
                message: 'Khong tim thay user',
            });
        }

        return res.json({ success: true, data: null });
    } catch (error) {
        return next(error);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const row = await db.User.findById(req.user._id).select(USER_PUBLIC_SELECT).lean();
        return res.json({ success: true, data: row });
    } catch (error) {
        return next(error);
    }
};

