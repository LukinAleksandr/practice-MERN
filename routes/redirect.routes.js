const { Router } = require('express')
const Link = require('../models/Link')
const router = Router()

//роутер перенаправления (если перешли по сгенерированной ссылке)
router.get('/:code', async (request, response) => {
  try {
    //поиск ссылки по парамерту взятому из юрл
    const link = await Link.findOne({ code: request.params.code })

    if (link) {
      //если такая ссылка есть увеличивает счетчик на 1 и пересохраняет модель
      link.clicks++
      await link.save()
      //перенаправляет на нужную страницу
      return response.redirect(link.from)
    }
    //выводит ошибку если ссылка не найдена
    response.status(404).json({ message: 'Ссылка не найдена!' })
  } catch (e) {
    response.status(500).json({ message: 'Что то не так!' })
  }
})

module.exports = router
