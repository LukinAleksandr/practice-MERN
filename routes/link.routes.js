//подключаем роутер
const { Router } = require('express')
//подключаем  конфиг
const config = require('config')
//подключаем модуль шертид
const shortid = require('shortid')
//подключаем модель для базы данных
const Link = require('../models/Link')
//подключаем мидлвеер для авторизации
const auth = require('../middleware/auth.middleware')
//создаем роутер
const router = Router()

//создаем роутер с промежуточной обработкой (добавляем мидлвеер auth который проверяет авторизован ли пользователь)
router.post('/generate', auth, async (request, response) => {
  try {
    //получаем базовый юрл из конфига
    const baseUrl = config.get('baseUrl')
    //из тела запроса получаем строку от пользователя и сохраняем в отдельную переменную
    const { from } = request.body
    //ищем в базе такую ссылку
    const existing = await Link.findOne({ from })
    //если совпадение есть, возпращаем ее на пользователю
    if (existing) {
      return response.json({ link: existing })
    }
    //регерируем случайный ключ для сылки
    const code = shortid.generate()

    //генерируем ссылку
    const to = baseUrl + '/t/' + code

    //сохраняем инстенс нашей схемы
    const link = new Link({
      code,
      to,
      from,
      owner: request.user.userId,
    })
    //сохраняем ее в базе
    await link.save()
    //возврпащаем пользователю
    response.status(201).json({ link })
  } catch (e) {
    response.status(500).json({ message: 'Беда' })
  }
})

//получаем все ссылки зарегистрированного пользователя и отдаем на фронтэнд
router.get('/', auth, async (request, response) => {
  try {
    const links = await Link.find({ owner: request.user.userId })
    response.json(links)
  } catch (e) {
    response.status(500).json({ message: 'Беда' })
  }
})

//получаем конкретную ссылку по ее id
router.get('/:id', auth, async (request, response) => {
  try {
    const link = await Link.findById(request.params.id)
    response.json(link)
  } catch (e) {
    response.status(500).json({ message: 'Беда' })
  }
})

module.exports = router
