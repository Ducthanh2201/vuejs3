import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:5173', // Địa chỉ frontend
  methods: ['GET', 'POST', 'DELETE'], 
  allowedHeaders: 'Content-Type, Authorization',
}));

// Middleware để parse dữ liệu JSON
app.use(express.json());

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Thư mục "uploads" đã được tạo.');
}

// Phục vụ tĩnh thư mục uploads
app.use('/uploads', express.static(uploadsDir));

// Cấu hình Multer để upload file
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

// Secret key cho JWT
const SECRET_KEY = 'my_secret_key';

// Middleware kiểm tra JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Đường dẫn tới db.json
const dbPath = path.join(__dirname, 'db.json');

// Đọc dữ liệu từ db.json
const getDatabase = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error('Lỗi khi đọc file db.json:', err);
    return {};
  }
};

// Lưu dữ liệu vào db.json
const saveDatabase = (updatedPart) => {
  try {
    const currentData = getDatabase();
    const mergedData = { ...currentData, ...updatedPart };
    fs.writeFileSync(dbPath, JSON.stringify(mergedData, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Lỗi khi ghi file db.json:', err);
    return false;
  }
};

// API đăng ký người dùng mới
app.post('/register', (req, res) => {
  const newUser = req.body;
  if (!newUser.user_name || !newUser.user_email || !newUser.user_password) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const db = getDatabase();
  const newUserId = db.users.length > 0 ? db.users[db.users.length - 1].user_id + 1 : 1;
  newUser.user_id = newUserId;

  const updatedUsers = [...db.users, newUser];
  if (saveDatabase({ users: updatedUsers })) {
    const token = jwt.sign({ userId: newUserId, email: newUser.user_email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({
      message: "Đăng ký thành công!",
      user: newUser,
      token,
    });
  } else {
    res.status(500).json({ message: "Lỗi khi lưu dữ liệu" });
  }
});

// API upload file ảnh
app.post('/upload', authenticateJWT, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'Chưa upload file' });
  }

  const fileUrl = `/uploads/${file.filename}`;
  res.status(200).json({
    message: 'Upload thành công',
    fileUrl,
  });
});

// API xóa người dùng
app.delete('/users/:userId', authenticateJWT, (req, res) => {
  const { userId } = req.params;
  const userIdNumber = parseInt(userId, 10);

  if (isNaN(userIdNumber)) {
    return res.status(400).json({ message: "user_id không hợp lệ" });
  }

  const db = getDatabase();
  const userIndex = db.users.findIndex(user => user.user_id === userIdNumber);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Người dùng không tồn tại" });
  }

  db.users.splice(userIndex, 1);

  if (saveDatabase({ users: db.users })) {
    res.status(200).json({ message: "Người dùng đã được xóa" });
  } else {
    res.status(500).json({ message: "Lỗi khi lưu dữ liệu" });
  }
});

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
