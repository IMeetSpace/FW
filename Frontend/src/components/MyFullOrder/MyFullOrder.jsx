import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './MyFullOrder.scss';

import axios from '../../axios';
import { selectAuth } from '../../redux/slices/auth';
import { getRemainingTime, months } from '../../utils/getRemainingTime';
import { getFormattedText } from '../../utils/getFormattedText';

const MyFullOrder = () => {
  const [data, setData] = React.useState();
  const [tenders, setTenders] = React.useState();
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
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (!authData) return;
    axios
      .get(`/orders/{"id": "${id}", "noInc": "true"}`)
      .then((res) => {
        setData(res.data);

        if (authData._id !== res.data.user._id) {
          navigate(`/orders/${id}`);
        }

        return axios
          .get(`/tenders/{"order": "${res.data._id}"}`)
          .then((res) => {
            setTenders(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.warn(err);
            alert('Ошибка при получении откликов');
          });
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении заказа');
      });
  }, [authData]);

  const deleteOrder = () => {
    if (window.confirm(`Удалить заказ ${id}?`)) {
      axios
        .delete(`/orders/${id}`)
        .then(() => {
          navigate('/my-orders');
        })
        .catch((err) => {
          console.log(err);
          alert('Ошибка при удалении заказа');
        });
    }
  };

  const acceptOrder = () => {
    if (window.confirm(`Отметить выполненным заказ ${id}?`)) {
      axios
        .post(`/orders/accept/${id}`)
        .then(() => {
          alert('Заказ отмечен выполненным');
          navigate('/my-orders');
        })
        .catch((err) => {
          console.log(err);
          alert('Ошибка при выполнении заказа');
        });
    }
  };

  const acceptTender = (action) => {
    const tenderId = action.target.outerHTML
      .match(/"(?:\w+)"/g)[0]
      .replaceAll('"', '');
    if (window.confirm(`Выбрать отклик ${tenderId}?`)) {
      axios
        .post(`/tenders/accept/${tenderId}`)
        .then((res) => {
          return axios
            .post('/dialogs', {
              sender: data.user._id,
              receiver: res.data.user,
            })
            .then((res) => {
              navigate(`/dialogs/${res.data._id}`);
            })
            .catch((err) => {
              console.log(err);
              alert('Ошибка при создании чата');
            });
        })
        .catch((err) => {
          console.log(err);
          alert('Ошибка при выборе отклика');
        });
    }
  };

  const openChat = (action) => {
    const userId = action.target.outerHTML
      .match(/"(?:\w+)"/g)[0]
      .replaceAll('"', '');
    return axios
      .post('/dialogs', {
        sender: data.user._id,
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
        <h1 className="title">Мои заказы / Заказ {id}</h1>
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

  const status = data.status.name;

  return (
    <main className="my-full-order">
      <h1 className="title">Мои заказы / Заказ {id}</h1>
      <div className="content">
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
            <div className="order-buttons">
              <div className={`order-status ${status}`}>{status}</div>
              {status === 'Создан' ? (
                <>
                  <button className="editOrder primary-button" hidden={!authData}>
                    <span>Изменить</span>
                  </button>
                  <button
                    onClick={deleteOrder}
                    className="deleteOrder primary-button"
                    hidden={!authData}>
                    <span>Удалить</span>
                  </button>
                </>
              ) : (
                ''
              )}
              {status === 'Назначен' ? (
                <>
                  <button
                    onClick={acceptOrder}
                    className="acceptOrder primary-button"
                    hidden={!authData}>
                    <span>Отметить выполненым</span>
                  </button>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {tenders.length === 0 ? (
          ''
        ) : (
          <>
            <h2 className="title-tender">Отклики ({tenders.length})</h2>

            {tenders.reverse().map((tender, index) => {
              let avatar = (
                <div className="avatar">{tender.user.nickname[0].toUpperCase()}</div>
              );
              const registration = new Date(tender.user.createdAt);
              let year = registration.getFullYear();
              let month = months()[registration.getMonth()];
              let day = registration.getDate();

              const description = getFormattedText(tender.description);

              return (
                <div key={index} className="tender-item">
                  <div className="author-block">
                    {avatar}
                    <div className="author-meta">
                      <div className="author-name">{tender.user.nickname}</div>
                      <div className="author-registration">
                        Зарегистрирован {`${day} ${month} ${year}`}
                      </div>
                    </div>
                    <div className="tender-price">{tender.price} ₽</div>
                  </div>
                  <div className="tender-block">
                    <div className="tender-description">{description}</div>
                    <div className="tender-footer">
                      <div className="tender-meta">
                        <div className="tender-dateRequired">
                          Срок выполнения (дней): {tender.dateRequire}
                        </div>
                      </div>
                      {status === 'Создан' ? (
                        <button
                          onClick={acceptTender}
                          className={`acceptTender primary-button ${tender._id}`}
                          hidden={!authData}>
                          <span className={`${tender._id}`}>Выбрать</span>
                        </button>
                      ) : (
                        ''
                      )}
                      {status === 'Назначен' || status === 'Выполнен' ? (
                        <button
                          onClick={openChat}
                          className={`openChat primary-button ${tender.user._id}`}
                          hidden={!authData}>
                          <span className={`${tender.user._id}`}>Перейти в чат</span>
                        </button>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </main>
  );
};

export default MyFullOrder;
