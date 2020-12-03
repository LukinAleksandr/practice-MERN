//подключаем библиотеку для работы с токенами
const jwt = require('jsonwebtoken')
//подключаем конфиг
const config = require('config')

module.exports = (request, response, next) => {
  if (request.method === 'OPTIONS') {
    return next()
  }

  try {
    //разбиваем свойство авторизация из заголовка запроса по пробелу
    const token = request.headers.authorization.split(' ')[1]
    //получаем наличие токена
    if (!token) {
      return response.status(401).json({ message: 'Нет авторизации' })
    }
    //верифицируем полученый токен по секретной строке из конфига
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    //добавляем дополнительное свойство в свойство реквест
    request.user = decoded
    next()
  } catch (e) {
    response.status(401).json({ message: 'Нет авторизации' })
  }
}
