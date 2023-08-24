import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './FullOrder.scss';

import axios from '../../axios';
import { selectAuth } from '../../redux/slices/auth';
import { getRemainingTime, getFullDate, months } from '../../utils/getRemainingTime';
import { getFormattedText } from '../../utils/getFormattedText';

const FullOrder = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const { id } = useParams();
  const authData = useSelector(selectAuth);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      description: '',
      price: '',
      dateRequire: '',
    },
    mode: 'onSubmit',
  });

  React.useEffect(() => {
    if (!authData) return;
    axios
      .get(`/orders/{"id": "${id}"}`)
      .then((res) => {
        setData(res.data);

        if (authData._id === res.data.user._id) {
          navigate(`/my-orders/${id}`);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении заказа');
      });
  }, [authData]);

  const onSubmit = async (values) => {
    if (!isValid) return;
    values.order = id;

    const token = window.localStorage.getItem('token');
    if (token) {
      if (authData._id !== data.user._id) {
        return axios
          .post('/tenders', values)
          .then((res) => {
            if (res.data.message !== 'Отклик уже создан') {
              navigate(`/tenders/${res.data._id}`);
            } else {
              alert('Отклик уже создан');
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      alert('Невозможно создать отклик на свой заказ');
    }
  };

  if (isLoading) {
    return (
      <main className="orders">
        <h1 className="title">Биржа заказов / Заказ {id}</h1>
        <div className="content"></div>
        <div className="order-item">
          <div className="order-header">
            <div className="order-title">Загрузка...</div>
          </div>
        </div>
      </main>
    );
  }

  const description = getFormattedText(data.description);

  let dateString = getRemainingTime(new Date(data.dateRequire), new Date());
  let remainingDaysCount = getRemainingTime(
    new Date(data.dateRequire),
    new Date(),
    true,
  );

  let avatar = <div className="avatar">{data.user.nickname[0].toUpperCase()}</div>;

  const registration = new Date(data.user.createdAt);
  let year = registration.getFullYear();
  let month = months()[registration.getMonth()];
  let day = registration.getDate();

  let showTenderForm = () => {
    const form = document.querySelector('.tender-block');
    form.toggleAttribute('hidden');
    const title = document.querySelector('h2');
    title.toggleAttribute('hidden');
    const btn = document.querySelector('.showTenderForm');
    btn.toggleAttribute('hidden');
  };

  return (
    <main className="full-order">
      <h1 className="title">Биржа заказов / Заказ {id}</h1>
      <div className="content">
        <div className="author-block">
          {avatar}
          <div className="author-meta">
            <div className="author-name">{data.user.nickname}</div>
            <div className="author-registration">
              Зарегистрирован {`${day} ${month} ${year}`}
            </div>
          </div>
        </div>
        <div className="order-block">
          <div className="order-header">
            <div className="order-title">{data.title}</div>
            <div className="order-price">{data.price} ₽</div>
          </div>
          <div className="order-description">{description}</div>
          <div className="order-footer">
            <div className="order-meta">
              <div className="order-require">Осталось: {dateString}</div>
              <div className="order-views">Просмотры: {data.views}</div>
            </div>
            <button
              onClick={showTenderForm}
              className="showTenderForm primary-button"
              hidden={!authData}>
              <span>Откликнуться</span>
            </button>
          </div>
        </div>
        <h2 className="title-tender" hidden>
          Отклик
        </h2>
        <form className="tender-block" onSubmit={handleSubmit(onSubmit)} hidden>
          <div className="tender-description">
            Сообщение к отклику
            <textarea
              {...register('description', {
                required:
                  'Сообщение должно быть не менее 50 символов и не более 1000 символов',
                minLength: 50,
                maxLength: 1000,
              })}
              type="text"
              placeholder="Напишите, как именно вы будете выполнять заказ"
              style={{ borderColor: errors.description && 'red' }}
            />
            <span className="hint">от 50 до 1000 символов</span>
          </div>
          <div className="tender-meta">
            <div className="meta-item tender-price">
              Стоимость
              <input
                {...register('price', {
                  required: 'Укажите стоимость',
                  min: 500,
                  max: data.price,
                })}
                type="number"
                placeholder="500"
                style={{ borderColor: errors.price && 'red' }}
              />
            </div>
            <div className="meta-item tender-dateRequired">
              Срок выполнения (дней)
              <input
                {...register('dateRequire', {
                  required: 'Укажите срок выполнения',
                  min: 1,
                  max: remainingDaysCount < 1 ? 1 : remainingDaysCount,
                })}
                type="number"
                placeholder="1 день"
                style={{ borderColor: errors.dateRequire && 'red' }}
              />
            </div>
            <button className="primary-button" type="submit">
              <span>Откликнуться</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default FullOrder;
