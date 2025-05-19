const asyncHandler = require('express-async-handler')
const News = require('../models/newsModel')
const path = require('path')

// Lấy danh sách bài viết

exports.getNews = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 9, sortBy = 'publishedDate', order = 'desc' } = req.query
  const query = type ? { type } : {}
  query.isDeleted = false

  // Nếu là staff, chỉ lấy bài viết của mình
  if (req.user && req.user.role === 'staff') {
    query.author = req.user.fullName
  }

  const skip = (Number(page) - 1) * Number(limit)

  // Kiểm tra trường sắp xếp hợp lệ
  const validSortFields = ['publishedDate', 'views', 'like', 'title']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'publishedDate'

  const sortQuery = {}
  sortQuery[sortField] = order === 'desc' ? -1 : 1

  const [news, total] = await Promise.all([
    News.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    News.countDocuments(query),
  ])

  // Tự thêm trường imageUrl vào từng bài viết với đường dẫn tuyệt đối và timestamp
  const timestamp = new Date().getTime()
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  const newsWithImageUrl = news.map((n) => {
    let imageUrl = ''
    if (n.image) {
      if (n.image.startsWith('http')) {
        imageUrl = `${n.image}?t=${timestamp}`
      } else {
        const cleanPath = n.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
        imageUrl = `${baseUrl}/${cleanPath}?t=${timestamp}`
      }
    }
    return { ...n, imageUrl }
  })

  const totalPages = Math.ceil(total / Number(limit))

  res.status(200).json({
    success: true,
    data: newsWithImageUrl,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
    message: 'Lấy danh sách bài viết thành công',
  })
})

// Lấy chi tiết bài viết

exports.getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id).lean()

  if (!news) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết')
  }

  // Không cho phép xem bài viết đã bị xóa nếu không đăng nhập hoặc không có quyền
  if (news.isDeleted) {
    // Kiểm tra xem người dùng đã đăng nhập và có quyền xem bài viết bị xóa không
    if (
      !req.user ||
      (req.user.role !== 'admin' &&
        (req.user.role !== 'staff' || news.author !== req.user.fullName))
    ) {
      res.status(404)
      throw new Error('Bài viết này không tồn tại hoặc đã bị xóa')
    }
  }

  // Nếu người dùng là staff, chỉ cho phép xem bài viết của mình
  if (req.user && req.user.role === 'staff' && news.author !== req.user.fullName) {
    res.status(403)
    throw new Error('Bạn không có quyền xem bài viết này')
  }

  // Tăng lượt xem
  await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

  // Tự thêm trường imageUrl vào object trả về với đường dẫn tuyệt đối và timestamp
  const timestamp = new Date().getTime()
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  let imageUrl = ''
  if (news.image) {
    if (news.image.startsWith('http')) {
      imageUrl = `${news.image}?t=${timestamp}`
    } else {
      const cleanPath = news.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
      imageUrl = `${baseUrl}/${cleanPath}?t=${timestamp}`
    }
  }
  const newsWithImageUrl = { ...news, imageUrl }

  res.status(200).json({
    success: true,
    data: newsWithImageUrl,
    message: 'Lấy chi tiết bài viết thành công',
  })
})

// Tạo bài viết mới

exports.createNews = asyncHandler(async (req, res) => {
  const { title, summary, content, image, type } = req.body

  // Kiểm tra các trường bắt buộc (đơn giản)
  if (!title || !summary || !content || !type) {
    res.status(400)
    throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc')
  }

  // Lấy author từ user đăng nhập
  const author = req.user ? req.user.fullName : 'Admin'

  try {
    const news = await News.create({
      title,
      summary,
      content,
      image,
      type,
      publishedDate: new Date(),
      views: 0,
      like: 0,
      author,
    })

    res.status(201).json({
      success: true,
      data: news,
      message: 'Tạo bài viết thành công',
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400)
      const messages = Object.values(error.errors).map((err) => err.message)
      throw new Error(messages.join(', '))
    }
    throw error
  }
})

// Cập nhật bài viết

exports.updateNews = asyncHandler(async (req, res) => {
  const updateData = req.body
  const newsId = req.params.id

  if (Object.keys(updateData).length === 0) {
    res.status(400)
    throw new Error('Không có dữ liệu để cập nhật')
  }

  let news
  if (req.user && req.user.role === 'staff') {
    news = await News.findOneAndUpdate(
      { _id: newsId, author: req.user.fullName },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean()
  } else {
    news = await News.findByIdAndUpdate(
      newsId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean()
  }

  if (!news) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết')
  }

  res.status(200).json({
    success: true,
    data: news,
    message: 'Cập nhật bài viết thành công',
  })
})

// Xóa bài viết (đánh dấu là đã xóa)

exports.deleteNews = asyncHandler(async (req, res) => {
  let news
  if (req.user && req.user.role === 'staff') {
    news = await News.findOneAndUpdate(
      { _id: req.params.id, author: req.user.fullName },
      { $set: { isDeleted: true } },
      { new: true }
    )
  } else {
    news = await News.findByIdAndUpdate(req.params.id, { $set: { isDeleted: true } }, { new: true })
  }

  if (!news) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết')
  }

  res.status(200).json({
    success: true,
    message: 'Đã ẩn bài viết thành công',
  })
})

// Xóa nhiều bài viết (đánh dấu là đã xóa)

exports.deleteNewsMany = asyncHandler(async (req, res) => {
  let { ids } = req.body
  if (req.user && req.user.role === 'staff') {
    // Lấy các bài viết thuộc staff
    const ownNews = await News.find({ _id: { $in: ids }, author: req.user.fullName })
    ids = ownNews.map((n) => n._id)
  }

  const result = await News.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } })

  if (result.modifiedCount === 0) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết nào để xóa')
  }

  res.status(200).json({
    success: true,
    message: `Đã ẩn ${result.modifiedCount} bài viết thành công`,
  })
})

// Upload ảnh
exports.uploadNewsImage = asyncHandler(async (req, res) => {
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

// Khôi phục bài viết
exports.restoreNews = asyncHandler(async (req, res) => {
  try {
    let news;
    if (req.user && req.user.role === 'staff') {
      news = await News.findOneAndUpdate(
        { _id: req.params.id, author: req.user.fullName, isDeleted: true },
        { $set: { isDeleted: false } },
        { new: true }
      );
    } else {
      news = await News.findOneAndUpdate(
        { _id: req.params.id, isDeleted: true },
        { $set: { isDeleted: false } },
        { new: true }
      );
    }
    
    if (!news) {
      res.status(404);
      throw new Error('Không tìm thấy bài viết hoặc bạn không có quyền khôi phục bài viết này');
    }

    res.status(200).json({
      success: true,
      data: news,
      message: 'Khôi phục bài viết thành công',
    });
  } catch (error) {
    console.error(`Lỗi khôi phục: ${error.message}`);
    throw error;
  }
});

// Xóa vĩnh viễn bài viết
exports.permanentDeleteNews = asyncHandler(async (req, res) => {
  let news
  if (req.user && req.user.role === 'staff') {
    news = await News.findOneAndDelete({ _id: req.params.id, author: req.user.fullName })
  } else {
    news = await News.findByIdAndDelete(req.params.id)
  }

  if (!news) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết hoặc bạn không có quyền xóa bài viết này')
  }

  res.status(200).json({
    success: true,
    message: 'Đã xóa vĩnh viễn bài viết thành công',
  })
})

// Lấy danh sách tin tức trong thùng rác
exports.getTrashNews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, sortBy = 'publishedDate', order = 'desc' } = req.query
  const query = { isDeleted: true } // Chỉ lấy tin đã xóa

  // Nếu là staff, chỉ lấy bài viết của mình
  if (req.user && req.user.role === 'staff') {
    query.author = req.user.fullName
  }

  const skip = (Number(page) - 1) * Number(limit)

  // Kiểm tra trường sắp xếp hợp lệ
  const validSortFields = ['publishedDate', 'views', 'like', 'title']
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'publishedDate'

  const sortQuery = {}
  sortQuery[sortField] = order === 'desc' ? -1 : 1

  const [news, total] = await Promise.all([
    News.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean(),
    News.countDocuments(query),
  ])

  // Tự thêm trường imageUrl vào từng bài viết với đường dẫn tuyệt đối và timestamp
  const timestamp = new Date().getTime()
  const baseUrl = req.app.locals.BASE_URL || 'http://localhost:3000'
  
  const newsWithImageUrl = news.map((n) => {
    let imageUrl = ''
    if (n.image) {
      if (n.image.startsWith('http')) {
        imageUrl = `${n.image}?t=${timestamp}`
      } else {
        const cleanPath = n.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
        imageUrl = `${baseUrl}/${cleanPath}?t=${timestamp}`
      }
    }
    return { ...n, imageUrl }
  })

  const totalPages = Math.ceil(total / Number(limit))

  res.status(200).json({
    success: true,
    data: newsWithImageUrl,
    pagination: {
      total,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    },
    message: 'Lấy danh sách tin tức trong thùng rác thành công',
  })
})
