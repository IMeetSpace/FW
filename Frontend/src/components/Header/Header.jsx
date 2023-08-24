import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './Header.scss';

import { selectAuth, logout } from '../../redux/slices/auth';

const Header = () => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuth);

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  return (
    <header className="navbar">
      <nav className="container">
        <div className="logo">
          <NavLink to="/">FreeWork</NavLink>
        </div>
        <ul className="nav-menu">
          {authData ? (
            <>
              <li>
                <NavLink to="/orders">Биржа заказов</NavLink>
              </li>
              <li>
                <NavLink to="/my-orders">Мои заказы</NavLink>
              </li>
              <li>
                <NavLink to="/tenders">Отклики</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/orders">Биржа заказов</NavLink>
              </li>
            </>
          )}
        </ul>
        <ul className="nav-menu self">
          {authData ? (
            <>
              <li>
                <NavLink to="/dialogs">Чаты</NavLink>
              </li>
              <li>Профиль</li>
              <li onClick={onClickLogout}>
                <NavLink to="/">Выйти</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Войти</NavLink>
              </li>
              <li>
                <NavLink to="/register">Зарегистрироваться</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
