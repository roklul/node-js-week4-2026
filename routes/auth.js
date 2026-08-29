const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const initialUsers = require('../fixtures/users.json');

const users = [...initialUsers];
let nextId = initialUsers.length + 1;

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 'false', message: '請提供 email 和 password' });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ status: 'false', message: 'email 已被註冊' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = { id: nextId++, email, password: hashedPassword };
  users.push(newUser);

  return res.status(201).json({ status: 'success', message: '註冊成功' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ status: 'false', message: '帳號或密碼錯誤' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ status: 'false', message: '帳號或密碼錯誤' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

  return res.status(200).json({ status: 'success', token });
});

router.get('/me', verifyToken, (req, res) => {
  return res.status(200).json({ status: 'success', user: req.user });
});

module.exports = router;