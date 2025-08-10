const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../config/db");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let verificationCodes = {};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length)
      return res.status(400).json({ message: "Email đã tồn tại" });
    await pool.query("BEGIN");
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (email, password, verified) VALUES (?, ?, ?)",
      [email, hashed, false]
    );

    const code = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = code;

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: "Xác nhận đăng ký",
    //   text: `Mã xác thực của bạn là: ${code}`,
    // });
    await pool.query("COMMIT");
    return res
      .status(200)
      .json({ message: "Đã gửi mã xác nhận đến email", data: { email, code } });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ message: "Lỗi máy chủ reg", error: err.message });
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] == code) {
    await pool.query("UPDATE users SET verified = true WHERE email = ?", [
      email,
    ]);
    delete verificationCodes[email];
    res.json({ message: "Xác thực thành công" });
  } else {
    res.status(400).json({ message: "Mã xác thực không đúng" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (!rows.length)
    return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

  const user = rows[0];
  if (!user.verified)
    return res.status(403).json({ message: "Tài khoản chưa được xác thực" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body.params;
  console.log(req.body)
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const user = rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedNewPassword, email]);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};