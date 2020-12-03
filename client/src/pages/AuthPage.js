import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'

export const AuthPage = () => {
  //получаем контекст
  const auth = useContext(AuthContext)
  //инициализируем хук вывода сообщений
  const message = useMessage()
  //диструктуризируем хук подключения к серверу на переменные
  const { loading, request, error, clearError } = useHttp()
  //создаем локальный стейт
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  //следим за ошибками
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  //метод изменения данных в стейте при вводе в инпуты данных
  const changeHandler = (ev) => {
    setForm({
      ...form,
      [ev.target.name]: ev.target.value,
    })
  }
  //настройка инпутов встроенным методом в materialize при загрузке страницы
  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  //метод регистрации
  const registerHandler = async () => {
    //отправка запроса на сервер с помощью метода колученного их хука http
    const data = await request('/api/auth/register', 'POST', { ...form })
    //вывод ответа от сервера с помощью хука message
    message(data.message)
  }

  const authorizationHandler = async () => {
    try {
      //отправка запроса на сервер с помощью метода колученного их хука http
      const data = await request('/api/auth/login', 'POST', { ...form })
      //вызов функции логирования из полученного контекста
      auth.login(data.token, data.userId)
    } catch (e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Сократи Ссылку</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  className="yellow-input"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              onClick={authorizationHandler}
              disabled={loading}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
