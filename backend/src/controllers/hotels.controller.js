import db from '../models/index.js';

const parseJsonFields = (payload) => {
  const hotelData = { ...payload };
  const jsonFields = ['amenities', 'policies', 'images', 'nearby_attractions', 'public_transport', 'room_types'];

  jsonFields.forEach((field) => {
    if (typeof hotelData[field] === 'string') {
      try {
        hotelData[field] = JSON.parse(hotelData[field]);
      } catch {
        hotelData[field] = hotelData[field] ? [hotelData[field]] : null;
      }
    }
  });

  return hotelData;
};

// Hàm chuyển đổi dữ liệu khách sạn từ database sang format frontend
const formatHotelData = (hotel) => {
  const formatted = hotel.toJSON();

  // Chuyển đổi rooms thành room_types format
  const rooms = formatted.rooms || [];
  const roomTypesMap = {};
  rooms.forEach(room => {
    const type = room.room_type || 'standard';
    if (!roomTypesMap[type]) {
      roomTypesMap[type] = {
        type: type,
        quantity: 0,
        price: Number(room.price), // Was price_per_night, model uses price
        capacity: room.capacity
      };
    }
    roomTypesMap[type].quantity += (room.quantity || 1);
  });
  const totalRooms = (formatted.rooms || []).reduce((sum, r) => sum + (r.quantity || 0), 0);

  // Filter out room_types locally if needed, but the logic above remains valid
  const roomTypes = Object.values(roomTypesMap);

  return {
    id: formatted.id,
    name: formatted.name,
    location: formatted.location,
    address: formatted.address,
    price: Number(formatted.price),
    star_rating: formatted.star_rating || null,
    image_url: formatted.image_url,
    images: formatted.images || [],
    description: formatted.description,
    amenities: Array.isArray(formatted.amenities) ? formatted.amenities : [],
    rooms: totalRooms,
    total_rooms: totalRooms,
    room_types: roomTypes,
    checkIn: formatted.check_in_time || '14:00',
    check_out_time: formatted.check_in_time || '14:00',
    checkOut: formatted.check_out_time || '12:00',
    check_out_time: formatted.check_out_time || '12:00',
    policies: formatted.policies || {
      cancel: 'Miễn phí hủy trước 48 giờ',
      children: 'Trẻ em ở miễn phí',
      pets: 'Không cho phép thú cưng',
      smoking: 'Không hút thuốc'
    },
    nearby_attractions: formatted.nearby_attractions || [],
    public_transport: formatted.public_transport || [],
    has_breakfast: formatted.has_breakfast || false,
    has_parking: formatted.has_parking || false,
    has_wifi: formatted.has_wifi !== false,
    has_pool: formatted.has_pool || false,
    has_restaurant: formatted.has_restaurant || false,
    has_gym: formatted.has_gym || false,
    has_spa: formatted.has_spa || false,
    allows_pets: formatted.allows_pets || false,
    is_smoking_allowed: formatted.is_smoking_allowed || false,
    status: formatted.status,
    approved_by: formatted.approved_by,
    approved_at: formatted.approved_at,
    approval_note: formatted.approval_note
  };
};

export const listHotels = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sort } = req.query;
    const where = { status: 'approved' };
    if (q) where.name = db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 'LIKE', `%${q.toLowerCase()}%`);
    if (minPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.lte]: Number(maxPrice) };
    const order = sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [['id', 'DESC']];
    const hotels = await db.Hotel.findAll({
      where,
      order,
      include: [{ model: db.Room, as: 'rooms', required: false }]
    });
    res.json(hotels.map(formatHotelData));
  } catch (e) { next(e); }
};

export const listAllHotels = async (req, res, next) => {
  try {
    const { q, minPrice, maxPrice, sort, status } = req.query;
    const where = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) where.status = status;
    if (q) where.name = db.Sequelize.where(db.Sequelize.fn('LOWER', db.Sequelize.col('name')), 'LIKE', `%${q.toLowerCase()}%`);
    if (minPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [db.Sequelize.Op.lte]: Number(maxPrice) };
    const order = sort === 'price_asc' ? [['price', 'ASC']] : sort === 'price_desc' ? [['price', 'DESC']] : [['id', 'DESC']];
    const hotels = await db.Hotel.findAll({
      where,
      order,
      include: [{ model: db.Room, as: 'rooms', required: false }]
    });
    res.json(hotels.map(formatHotelData));
  } catch (e) { next(e); }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id, {
      include: [{ model: db.Room, as: 'rooms', required: false }]
    });
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    res.json(formatHotelData(hotel));
  } catch (e) { next(e); }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotelData = parseJsonFields(req.body);
    const roomTypes = hotelData.room_types;
    delete hotelData.room_types; // Xóa room_types khỏi hotelData vì không phải field của Hotel
    delete hotelData.total_rooms; // Remove total_rooms if sent from frontend

    // Tính giá thấp nhất từ room_types (giá khách sạn start from)
    if (Array.isArray(roomTypes) && roomTypes.length > 0) {
      // Find min price
      const minPrice = Math.min(...roomTypes.map(rt => Number(rt.price) || 0).filter(p => p > 0));
      hotelData.price = minPrice !== Infinity ? minPrice : 0;
    }

    hotelData.status = 'pending';
    hotelData.approved_by = null;
    hotelData.approved_at = null;
    hotelData.approval_note = null;

    const created = await db.Hotel.create(hotelData);

    // Tạo rooms từ room_types
    if (Array.isArray(roomTypes) && roomTypes.length > 0) {
      const rooms = roomTypes.map(rt => ({
        hotel_id: created.id,
        name: `${ROOM_TYPES[rt.type]?.label || rt.type} - ${rt.capacity} người`,
        room_type: rt.type,
        price: rt.price,
        capacity: rt.capacity,
        quantity: rt.quantity
      }));
      await db.Room.bulkCreate(rooms);
    }

    res.status(201).json(created);
  } catch (e) { next(e); }
};

const ROOM_TYPES = {
  standard: { label: 'Phòng tiêu chuẩn' },
  deluxe: { label: 'Phòng deluxe' },
  suite: { label: 'Suite' },
  family: { label: 'Phòng gia đình' }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });

    const hotelData = parseJsonFields(req.body);
    const roomTypes = hotelData.room_types;
    delete hotelData.room_types; // Xóa room_types khỏi hotelData
    delete hotelData.total_rooms; // Remove total_rooms if sent from frontend

    // Tính giá thấp nhất từ room_types (giá khách sạn start from)
    if (Array.isArray(roomTypes) && roomTypes.length > 0) {
      const minPrice = Math.min(...roomTypes.map(rt => Number(rt.price) || 0).filter(p => p > 0));
      hotelData.price = minPrice !== Infinity ? minPrice : hotelData.price || 0;
    }

    const statusChangedToApproved = hotelData.status === 'approved' && hotel.status !== 'approved';
    const statusChangedToPending = hotelData.status === 'pending';
    const statusChangedToRejected = hotelData.status === 'rejected';

    if (statusChangedToApproved) {
      hotelData.approved_by = req.user?.id || hotel.approved_by;
      hotelData.approved_at = new Date();
    } else if (statusChangedToPending) {
      hotelData.approved_by = null;
      hotelData.approved_at = null;
    } else if (statusChangedToRejected) {
      hotelData.approved_by = req.user?.id || null;
      hotelData.approved_at = new Date();
    }

    await hotel.update(hotelData);

    // Cập nhật rooms từ room_types
    if (Array.isArray(roomTypes)) {
      // Xóa tất cả rooms cũ
      await db.Room.destroy({ where: { hotel_id: hotel.id } });

      // Tạo rooms mới
      if (roomTypes.length > 0) {
        const rooms = roomTypes.map(rt => ({
          hotel_id: hotel.id,
          name: `${ROOM_TYPES[rt.type]?.label || rt.type} - ${rt.capacity} người`,
          room_type: rt.type,
          price: rt.price,
          capacity: rt.capacity,
          quantity: rt.quantity
        }));
        await db.Room.bulkCreate(rooms);
      }
    }

    res.json(hotel);
  } catch (e) { next(e); }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await db.Hotel.findByPk(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Not found' });
    await hotel.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
};


