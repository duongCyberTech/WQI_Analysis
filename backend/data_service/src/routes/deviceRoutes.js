const express = require('express');
const router = express.Router();
const Device = require('../models/device');
const auth = require('../middlewares/auth');

// Lấy danh sách thiết bị
router.get('/', auth(['admin']), async (req, res) => {
  const devices = await Device.findAll();
  res.json(devices);
});

// Thêm thiết bị mới
router.post('/', auth(['admin']), async (req, res) => {
  const { name, sensorType, location, specs } = req.body;
  if (!name || !sensorType || !location) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const device = await Device.create({ name, sensorType, location, specs });
  res.status(201).json(device);
});

// Cập nhật thiết bị
router.put('/:id', auth(['admin']), async (req, res) => {
  const { id } = req.params;
  const device = await Device.findByPk(id);
  if (!device) return res.status(404).json({ error: 'Không tìm thấy thiết bị' });

  await device.update(req.body);
  res.json(device);
});

// Xoá thiết bị
router.delete('/:id', auth(['admin']), async (req, res) => {
  const { id } = req.params;
  const device = await Device.findByPk(id);
  if (!device) return res.status(404).json({ error: 'Không tìm thấy thiết bị' });

  await device.destroy();
  res.json({ message: 'Đã xoá thiết bị' });
});

module.exports = router;
