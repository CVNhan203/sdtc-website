const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Tên đầy đủ là bắt buộc"],
    unique: true,
    trim: true,
    minlength: [3, "Tên phải có ít nhất 3 ký tự"],
    maxlength: [50, "Tên không được vượt quá 50 ký tự"],
    match: [/^[a-zA-Z\s]/, "Tên chỉ được chứa chữ cái và khoảng trắng"],
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: [true, "Email đã được sử dụng"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Vui lòng nhập email hợp lệ (ví dụ: nam.vuphanhoai@gmail.com)",
    ],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
    minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
    validate: {
      validator: function (value) {
        // Kiểm tra độ phức tạp: ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message:
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "staff"],
      message: "Vai trò không hợp lệ",
   
    },
    default: "staff",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

// Middleware: Mã hóa mật khẩu trước khi lưu
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(new Error("Lỗi khi mã hóa mật khẩu: " + err.message));
  }
});

// Phương thức instance: So sánh mật khẩu khi đăng nhập
adminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error("Lỗi khi so sánh mật khẩu: " + err.message);
  }
};

module.exports = mongoose.model("Admin", adminSchema);