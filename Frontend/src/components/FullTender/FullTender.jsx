import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './FullTender.scss';

import axios from '../../axios';
import { selectAuth } from '../../redux/slices/auth';
import { getRemainingTime, getFullDate, months } from '../../utils/getRemainingTime';
import { getFormattedText } from '../../utils/getFormattedText';

const FullTender = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();

  const { id } = useParams();
  const authData = useSelector(selectAuth);

  React.useEffect(() => {
    axios
      .get(`/tenders/{"id": "${id}"}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении отклика');
      });
  }, []);

  const deleteTender = () => {
    if (window.confirm(`Удалить отклик ${id}?`)) {
      axios
        .delete(`/tenders/${id}`)
        .then(() => {
          navigate('/tenders');
        })
        .catch((err) => {
          console.log(err);
          alert('Ошибка при удалении отклика');
        });
    }
  };

  const openChat = (action) => {
    const userId = action.target.outerHTML
      .match(/"(?:\w+)"/g)[0]
      .replaceAll('"', '');
    return axios
      .post('/dialogs', {
        sender: authData._id,
        receiver: userId,
      })
      .then((res) => {
        navigate(`/dialogs/${res.data._id}`);
      })
      .catch((err) => {
        console.log(err);
        alert('Ошибка при открытии чата');
      });
  };

  if (isLoading) {
    return (
      <main className="orders">
        <h1 className="title">Отклики / Отклик {id}</h1>
        <div className="content"></div>
        <div className="order-item">
          <div className="order-header">
            <div className="order-title">Загрузка...</div>
          </div>
        </div>
      </main>
    );
  }

  const description = getFormattedText(data.order.description);

  let dateString = getRemainingTime(new Date(data.order.dateRequire), new Date());

  let avatar = (
    <div className="avatar">{data.order.user.nickname[0].toUpperCase()}</div>
  );

  const registration = new Date(data.order.user.createdAt);
  let year = registration.getFullYear();
  let month = months()[registration.getMonth()];
  let day = registration.getDate();

  const status = data.status.name;

  return (
    <main className="full-tender">
      <h1 className="title">Отклики / Отклик {id}</h1>
      <div className="content">
        <div className="author-block">
          {avatar}
          <div className="author-meta">
            <div className="author-name">{data.order.user.nickname}</div>
            <div className="author-registration">
              Зарегистрирован {`${day} ${month} ${year}`}
            </div>
          </div>
        </div>
        <div className="order-block">
          <div className="order-header">
            <div className="order-title">{data.order.title}</div>
            <div className="order-price">{data.order.price} ₽</div>
          </div>
          <div className="order-description">{description}</div>
          <div className="order-footer">
            <div className="order-meta">
              <div className="order-require">Осталось: {dateString}</div>
              <div className="order-views">Просмотры: {data.order.views}</div>
            </div>
          </div>
        </div>
        <div className="tender-block">
          <div className="tender-description">
            Сообщение к отклику
            <textarea readOnly value={data.description} />
          </div>
          <div className="tender-meta">
            <div className="meta-item tender-price">
              Стоимость
              <input readOnly value={data.price} />
            </div>
            <div className="meta-item tender-dateRequired">
              Срок выполнения (дней)
              <input readOnly value={data.dateRequire} />
            </div>
            <div className="order-buttons">
              <div className={`order-status ${status}`}>{status}</div>
              {data.status.name === 'Создан' ? (
                <button
                  onClick={deleteTender}
                  className="deleteTender primary-button"
                  hidden={!authData}>
                  <span>Удалить</span>
                </button>
              ) : (
                ''
              )}
              {data.status.name === 'Назначен' || status === 'Выполнен' ? (
                <button
                  onClick={openChat}
                  className={`openChat primary-button ${data.order.user._id}`}
                  hidden={!authData}>
                  <span className={`${data.order.user._id}`}>Перейти в чат</span>
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullTender;
