const { Router } = require('express')
const bycrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/Users')

const router = Router()

router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов').isLength({
      min: 6,
    }),
  ],

  async (request, response) => {
    try {
      const errors = validationResult(request)

      if (!errors.isEmpty()) {
        return response.status(201).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })
      }

      const { email, password } = request.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return response
          .status(201)
          .json({ message: 'Такой пользователь уже существует' })
      }
      const hashedPassword = await bycrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
      await user.save()

      response.status(200).json({ message: 'Пользователь создан!' })
    } catch (e) {
      console.log(e)
      response.status(500).json({ message: 'Беда' })
    }
  }
)

router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request)
      if (!errors.isEmpty()) {
        return response.status(201).json({
          errors: errors.array(),
          message: 'Некорректные данные при авторизации',
        })
      }
      const { email, password } = request.body

      const user = await User.findOne({ email })
      if (!user) {
        return response
          .status(200)
          .json({ message: 'Такой пользователь не существует' })
      }
      const isMatch = await bycrypt.compare(password, user.password)

      if (!isMatch) {
        return response.status(200).json({ message: 'Неверный пароль' })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })
      response.status(200).json({ token, userId: user.id })
    } catch (e) {
      response.status(500).json({ message: 'Что-то пошло не так' })
    }
  }
)

module.exports = router
