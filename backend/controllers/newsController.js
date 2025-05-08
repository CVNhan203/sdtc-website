const asyncHandler = require('express-async-handler')
const News = require('../models/newsModel')

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

  // Tự thêm trường imageUrl vào từng bài viết (URL tuyệt đối)
  const newsWithImageUrl = news.map((n) => {
    let imageUrl = ''
    if (n.image) {
      if (n.image.startsWith('http')) {
        imageUrl = n.image
      } else {
        const host = req.protocol + '://' + req.get('host')
        imageUrl = host + '/' + n.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
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
  const news = await News.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean()

  if (!news) {
    res.status(404)
    throw new Error('Không tìm thấy bài viết')
  }

  // Tự thêm trường imageUrl vào object trả về (URL tuyệt đối)
  let imageUrl = ''
  if (news.image) {
    if (news.image.startsWith('http')) {
      imageUrl = news.image
    } else {
      const host = req.protocol + '://' + req.get('host')
      imageUrl = host + '/' + news.image.replace(/^\\+|^\/+/, '').replace(/\\/g, '/')
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
  });
});

