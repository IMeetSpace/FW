import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './Register.scss';

import { fetchRegister, fetchAuthMe, selectAuth } from '../../redux/slices/auth';

const Register = () => {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values) => {
    if (!isValid) return;
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Не удалось зарегистрироваться');
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
    <main className="register">
      <h2 className="title">Регистрация</h2>
      <div className="content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('email', {
              required: 'Укажите электронную почту',
              pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]+$/g,
            })}
            type="text"
            placeholder="Электронная почта"
            style={{ borderColor: errors.email && 'red' }}
          />
          <input
            {...register('password', {
              required: 'Укажите пароль',
              minLength: 5,
              maxLength: 20,
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

export default Register;
