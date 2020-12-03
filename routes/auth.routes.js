//подключаем метод роутер сервера express
const { Router } = require('express')
//устанавливаем и подключаем библиотеку бикрипт для шифрования и сравнивание херей паролей
const bycrypt = require('bcryptjs')
//устанавливаем конфиг (своего рода константы в документа config.json)
const config = require('config')
//устанавливаем и подключаем библиотеку для валидирования данных
const { check, validationResult } = require('express-validator')
//устанавливаем и подключаем библиотеку для создания вебтокенов
const jwt = require('jsonwebtoken')
//устанавливаем и подключаем схему пользователя для базы данных mongoDB
const User = require('../models/Users')

//инициализируем новый роутер
const router = Router()

// добавляем обработчик запроса по адресу /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов').isLength({
      min: 6,
    }),
  ],

  //request - запрос, response - ответ
  async (request, response) => {
    try {
      //создаем переменную в которую сохранятся тексты ошибок в случае если валидация данных в запросе не пройдет проверку
      //метод validationResult проверяет данные request на то что заданно в check (находится в аргументах метода router.post)
      const errors = validationResult(request)

      //если массив ошибок не пустой возпращаем ошибки бользователю в виде объекта json
      if (!errors.isEmpty()) {
        return response.status(201).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })
      }

      //если проверки прошли делаем диструктуризацию свойств объекта body
      const { email, password } = request.body
      //тут каким то магическим образом проверяем есть ли в базе пользователь с такой почтой
      const candidate = await User.findOne({ email })
      // если есть что то в переменной  возвращаем ошибку с сообщением
      if (candidate) {
        return response
          .status(201)
          .json({ message: 'Такой пользователь уже существует' })
      }
      //если такой пользователь не занят хешируем пароль
      const hashedPassword = await bycrypt.hash(password, 12)
      //опять с помощью магии добавляем нового пользователя
      const user = new User({ email, password: hashedPassword })
      // и сохраняем в базе данных
      await user.save()

      // тут похоже нужно проверить как то ответ от базы данных,
      // что пользователь реально создался, а не отвалился где-то при передаче данных в базу
      //возвращаем ответ что пользователь создан
      response.status(200).json({ message: 'Пользователь создан!' })
    } catch (e) {
      console.log(e)
      response.status(500).json({ message: 'Беда' })
    }
  }
)

// /api/auth/login  метод авторизации
router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (request, response) => {
    try {
      //проверяем валидность данных
      const errors = validationResult(request)
      //если есть ошибки возвращаем их
      if (!errors.isEmpty()) {
        return response.status(201).json({
          errors: errors.array(),
          message: 'Некорректные данные при авторизации',
        })
      }
      //делаем диструктуризацию боди в переменные
      const { email, password } = request.body

      //ищем пользователя в базе
      const user = await User.findOne({ email })
      //возвращаем ошибку если пользователя с такой почтой не существует
      if (!user) {
        return response
          .status(200)
          .json({ message: 'Такой пользователь не существует' })
      }
      //если пользователь найден проверяем через модуль бикрипт совпадения хеша переданного пароля с хешем хранящимся в базе
      const isMatch = await bycrypt.compare(password, user.password)

      if (!isMatch) {
        //если пароли не совпадают возвращаем ошибку
        return response.status(200).json({ message: 'Неверный пароль' })
      }

      //если пароль правильный создаем токен из id пользователя и секретной строки, а также указываем время жизни 1час
      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })

      //возвращаем на фронтэнд обьект с пользователем
      response.status(200).json({ token, userId: user.id })
    } catch (e) {
      response.status(500).json({ message: 'Что-то пошло не так' })
    }
  }
)

module.exports = router
