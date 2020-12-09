import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { CreatePage } from './pages/CreatePage'
import { DetalingPage } from './pages/DetalingPage'
import { LinksPage } from './pages/LinksPage'

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links" exect>
          <LinksPage></LinksPage>
        </Route>
        <Route path="/create" exect>
          <CreatePage></CreatePage>
        </Route>
        <Route path="/detail/:id" exect>
          <DetalingPage></DetalingPage>
        </Route>
        <Redirect to="/create"></Redirect>
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path="/" exect>
        <AuthPage></AuthPage>
      </Route>
      <Redirect to="/"></Redirect>
    </Switch>
  )
}
