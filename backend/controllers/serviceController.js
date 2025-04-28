const asyncHandler = require("express-async-handler");
const Service = require("../models/serviceModel");

exports.getServices = asyncHandler(async (req, res) => {
  const {
    type,
    page = 1,
    limit = 9,
    sortBy = "price",
    order = "asc",
  } = req.query;
  const query = type ? { type } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const sortQuery = {};
  sortQuery[sortBy] = order === "desc" ? -1 : 1;

  const [services, total] = await Promise.all([
    Service.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    Service.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / Number(limit));

  res.status(200).json({
    success: true,
    data: services,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
    message: "Lấy danh sách dịch vụ thành công",
  });
});

exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).lean();

  if (!service) {
    res.status(404);
    throw new Error("Không tìm thấy dịch vụ");
  }

  res.status(200).json({
    success: true,
    data: service,
    message: "Lấy chi tiết dịch vụ thành công",
  });
});

exports.createService = asyncHandler(async (req, res) => {
  try {
    const { title, description, price, image, type } = req.body;

    const service = await Service.create({
      title,
      description,
      price: Number(price),
      image,
      type,
    });

    res.status(201).json({
      success: true,
      data: service,
      message: "Tạo dịch vụ thành công",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error(
        Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")
      );
    }
    throw error;
  }
});

exports.updateService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404);
      throw new Error("Không tìm thấy dịch vụ");
    }

    res.status(200).json({
      success: true,
      data: service,
      message: "Cập nhật dịch vụ thành công",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
      throw new Error(
        Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")
      );
    }
    throw error;
  }
});

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error("Không tìm thấy dịch vụ");
  }

  res.status(200).json({
    success: true,
    message: "Xóa dịch vụ thành công",
  });
});
