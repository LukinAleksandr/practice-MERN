//импорт функции создания контекста
import { createContext } from 'react'
//пустая функция заглушка
function noop() {}

export const AuthContext = createContext({
  //начальные значения токена и ид юзера, а также фунции логирования и делогирования + статус авторизации
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuth: false,
})
