import React, {useEffect, useContext, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import {Context} from './index';
import {observer} from "mobx-react-lite";
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {

  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if(localStorage.getItem('token')) {
       store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  if(store.isLoading) {
    return <div>Загрузка...</div>;
  }

  if(!store.isAuth) {
    return(
      <LoginForm />
    );
  };

  return (
    <div className="App">
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторизуйтесь' }</h1>
      <h3>{store.user.isActivated ? 'Аккаунт подтвержен по почте !' : 'Подтвердите аккаунт'}</h3>
      <button onClick={() => {store.logout()}}>Выйти</button>
      <button onClick={getUsers}>Получить всех пользователей</button>
      {users.map(user => <div key={user.email}>{user.email}</div>)}
    </div>
  );
}

export default observer(App);
