import React from 'react'
//подключаем компонент роутера из библиотеки
import { BrowserRouter as Router } from 'react-router-dom'
//подключаем установленный материалазй
import 'materialize-css'
//подключаем компонент который показывает контент в зависимости от авторизации пользоватея
import { useRoutes } from './routes'
//подключаем хук который возвращает токен пользователя, функцию логирования и делогирования, пользовательский ид, и состояние готовности
import { useAuth } from './hooks/auth.hook'
//получаем созданый контекст для нашего приложения
import { AuthContext } from './context/AuthContext'
//компонент нащей шапки сайта
import { Navbar } from './components/Navbar'
//компонент лоадера
import { Loader } from './components/Loader'

function App() {
  //диструктуризируем обьект из хука авторизации на переменные
  const { token, login, logout, userId, ready } = useAuth()
  //статус авторизации исходя от наличия токена
  const isAuth = !!token
  //создаем роутер и передаем в него статус авторизации
  const routes = useRoutes(isAuth)
  //показуем лоадер если процесс загрузки авторизации не закончен и ре
  if (!ready) {
    return <Loader></Loader>
  }
  return (
    //обарачиваем приложение в наш контекст и передаем в него значения
    <AuthContext.Provider value={{ token, login, logout, userId, isAuth }}>
      <Router>
        {/* показываем навбар если авторизированный пользоваетль */}
        {isAuth ? <Navbar></Navbar> : null}
        <div>{routes}</div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
