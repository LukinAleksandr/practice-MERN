//устанавливаем и подключаем сервер express
const express = require('express')
//устанавливаем и подключаем конфиг (своего рода константы в документа config.json)
const config = require('config')
//устанавливаем и подключаем базу данных mongoDB
const mongoose = require('mongoose')
//подключаем модуль для работы с мутями
const pt = require('path')

//инициализируем єкспресс
const app = express()

//добавляем Middleware для перевода тела (body) запроса в json между этапами получения за проса и возвратом ответа от сервера
app.use(express.json({ extended: true }))

//добавляем роутер если обращаются по адресу http://localhost:5000/api/auth
app.use('/api/auth', require('./routes/auth.routes'))
//добавляем роутер если обращаются по адресу http://localhost:5000/api/link
app.use('/api/link', require('./routes/link.routes'))
//добавляем роутер если обращаются по адресу http://localhost:5000/api/t
app.use('/t', require('./routes/redirect.routes'))

//проверка системной переменной
if (process.env.NODE_ENV === 'production') {
  //если это продакшн, то используем функцию промежуточно обработки static передаем через нее путь где лежат наши файлы для выгрузки
  app.use('/', express.static(pt.join(__dirname, 'client', 'build')))
  //говорим что возвращать при любых запросах индексный файл
  app.get('*', (request, response) => {
    response.sendFile(pt.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

//сохраняем в константу порт из конфига
const PORT = config.get('port') || 5000

async function start() {
  try {
    //асинхронно создаем подключение к бд передавая наш юрл из конфига и настройки
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    //запускаем наш сервер на порту 5000
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    )
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

//стартуем сервер
start()
