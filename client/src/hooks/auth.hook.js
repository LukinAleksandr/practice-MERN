import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(null)
  const [userId, setUserId] = useState(null)
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)

    localStorage.setItem(
      'userData',
      JSON.stringify({ token: jwtToken, userId: id })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)

    localStorage.removeItem('userData')
  }, [])

  useEffect(() => {
    const ls = JSON.parse(localStorage.getItem('userData'))
    if (ls && ls.token) {
      login(ls.token, ls.userId)
    }
    setReady(true)
  }, [login])
  return { login, logout, token, userId, ready }
}
