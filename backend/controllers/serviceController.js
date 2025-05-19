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

  // Thêm trường imageUrl vào từng dịch vụ với đường dẫn tuyệt đối và timestamp
  const timestamp = new Date().getTime()
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  const servicesWithImageUrl = services.map((s) => {
    let imageUrl = ''
    if (s.image) {
      if (s.image.startsWith('http')) {
        imageUrl = `${s.image}?t=${timestamp}`
      } else {
        const cleanPath = s.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
        imageUrl = `${baseUrl}/${cleanPath}?t=${timestamp}`
      }
    }
    return { ...s, imageUrl }
  })

  const totalPages = Math.ceil(total / Number(limit))

  res.status(200).json({
    success: true,
    data: servicesWithImageUrl,
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

  // Thêm trường imageUrl với đường dẫn tuyệt đối và timestamp
  const timestamp = new Date().getTime()
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  let imageUrl = ''
  if (service.image) {
    if (service.image.startsWith('http')) {
      imageUrl = `${service.image}?t=${timestamp}`
    } else {
      const cleanPath = service.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
      imageUrl = `${baseUrl}/${cleanPath}?t=${timestamp}`
    }
  }
  const serviceWithImageUrl = { ...service, imageUrl }

  res.status(200).json({
    success: true,
    data: serviceWithImageUrl,
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
    throw new Error('Vui lòng tải lên một file ảnh')
  }

  // Lấy đường dẫn tương đối của file, phù hợp để lưu vào db
  const relativePath = path.join('uploads', 'images', req.file.filename).replace(/\\/g, '/')
  
  // Thêm timestamp vào đường dẫn để tránh cache
  const timestamp = new Date().getTime()
  
  // Lấy BASE_URL từ app.locals
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  // Tạo đường dẫn đầy đủ với BASE_URL và timestamp
  const fullPath = `${baseUrl}/${relativePath}?t=${timestamp}`

  res.status(200).json({
    success: true,
    imagePath: relativePath,
    fullPath: fullPath,
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
