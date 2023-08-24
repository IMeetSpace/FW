import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './Login.scss';

import { fetchAuth, fetchAuthMe, selectAuth } from '../../redux/slices/auth';

const Login = () => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values) => {
    if (!isValid) return;

    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Не удалось авторизоваться');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }

    dispatch(fetchAuthMe());
  };

  if (authData) {
    return <Navigate to="/" />;
  }

  return (
    <main className="login">
      <h2 className="title">Вход в аккаунт</h2>
      <div className="content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('login', {
              required: 'Укажите логин',
              minLength: 1,
            })}
            type="text"
            placeholder="Логин или электронная почта"
          />
          <input
            {...register('password', {
              required: 'Укажите пароль',
              minLength: 5,
              maxlength: 20,
            })}
            type="text"
            placeholder="Пароль"
            style={{ borderColor: errors.password && 'red' }}
          />
          <button className="primary-button" type="submit">
            Применить
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
