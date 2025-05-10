const asyncHandler = require('express-async-handler')
const Service = require('../models/serviceModel')
const path = require('path')
const fs = require('fs')

exports.getServices = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 9, sortBy = 'price', order = 'asc' } = req.query
  const query = type ? { type } : {}
  query.isDeleted = false
  const skip = (Number(page) - 1) * Number(limit)

  const sortQuery = {}
  sortQuery[sortBy] = order === 'desc' ? -1 : 1

  // Nếu limit = 0, lấy tất cả dịch vụ
  const limitValue = Number(limit) === 0 ? null : Number(limit)

  let servicesQuery = Service.find(query).sort(sortQuery)

  // Chỉ áp dụng skip và limit nếu limit > 0
  if (limitValue) {
    servicesQuery = servicesQuery.skip(skip).limit(limitValue)
  }

  const [services, total] = await Promise.all([servicesQuery.lean(), Service.countDocuments(query)])

  const totalPages = Math.ceil(total / Number(limit))

  res.status(200).json({
    success: true,
    data: services,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
    message: 'Lấy danh sách dịch vụ thành công',
  })
})

exports.getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).lean()

  if (!service) {
    res.status(404)
    throw new Error('Không tìm thấy dịch vụ')
  }

  res.status(200).json({
    success: true,
    data: service,
    message: 'Lấy chi tiết dịch vụ thành công',
  })
})

exports.createService = asyncHandler(async (req, res) => {
  const { title, description, price, image, type } = req.body
  const service = await Service.create({
    title,
    description,
    price: Number(price),
    image,
    type,
  })
  res.status(201).json({
    success: true,
    data: service,
    message: 'Tạo dịch vụ thành công',
  })
})

exports.updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )

  if (!service) {
    res.status(404)
    throw new Error('Không tìm thấy dịch vụ')
  }

  res.status(200).json({
    success: true,
    data: service,
    message: 'Cập nhật dịch vụ thành công',
  })
})

exports.deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: true } },
    { new: true }
  )

  if (!service) {
    res.status(404)
    throw new Error('Không tìm thấy dịch vụ')
  }

  res.status(200).json({
    success: true,
    message: 'Đã ẩn dịch vụ thành công',
  })
})

exports.uploadServiceImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('Vui lòng chọn ảnh để tải lên')
  }

  const imagePath = req.file.path.replace(/\\/g, '/')

  res.status(200).json({
    success: true,
    imagePath: imagePath,
    message: 'Tải ảnh lên thành công',
  })
})

// Khôi phục dịch vụ đã xóa
exports.restoreService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: false } },
    { new: true }
  )

  if (!service) {
    res.status(404)
    throw new Error('Không tìm thấy dịch vụ')
  }

  res.status(200).json({
    success: true,
    data: service,
    message: 'Đã khôi phục dịch vụ thành công',
  })
})

// Xóa vĩnh viễn dịch vụ
exports.permanentDeleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)

  if (!service) {
    res.status(404)
    throw new Error('Không tìm thấy dịch vụ')
  }

  res.status(200).json({
    success: true,
    message: 'Đã xóa vĩnh viễn dịch vụ thành công',
  })
})
