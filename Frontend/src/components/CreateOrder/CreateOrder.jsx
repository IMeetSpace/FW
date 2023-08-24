import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import './CreateOrder.scss';

import { fetchCategories } from '../../redux/slices/orders';

import axios from '../../axios';
import { selectAuth } from '../../redux/slices/auth';
import { getFullDate } from '../../utils/getRemainingTime';

const CreateOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, categories } = useSelector((state) => state.orders);

  const isCategoriesLoading = categories.status === 'loading';

  const authData = useSelector(selectAuth);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'Дизайн',
      description: '',
      price: '',
      dateRequire: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values) => {
    if (!isValid) return;

    axios
      .post('/orders/', values)
      .then((res) => {
        navigate(`/my-orders/${res.data._id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create-order">
      <h1 className="title">Создание заказа</h1>
      <div className="content">
        <form className="order-block" onSubmit={handleSubmit(onSubmit)}>
          <div className="order-header">
            Название заказа
            <div className="data">
              <input
                {...register('title', {
                  required:
                    'Название должно быть не менее 6 символов и не более 50 символов',
                  minLength: 6,
                  maxLength: 50,
                })}
                type="text"
                placeholder="Название заказа"
                style={{ borderColor: errors.title && 'red' }}
              />
              <div className="category">
                Категория
                <select
                  {...register('category', {})}
                  style={{ borderColor: errors.category && 'red' }}>
                  {isCategoriesLoading
                    ? ''
                    : categories.items.map((item, index) => (
                        <option
                          key={index}
                          value={item}
                          selected={index === 0 ? 'selected' : ''}>
                          {item}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </div>
          <div className="order-description">
            Описание
            <textarea
              {...register('description', {
                required:
                  'Описание должно быть не менее 50 символов и не более 1000 символов',
                minLength: 50,
                maxLength: 1000,
              })}
              type="text"
              placeholder="Напишите, что именно требуется сделать"
              style={{ borderColor: errors.description && 'red' }}
            />
            <span className="hint">от 50 до 1000 символов</span>
          </div>
          <div className="order-meta">
            <div className="meta-item order-price">
              Стоимость
              <input
                {...register('price', {
                  required: 'Укажите стоимость',
                  min: 500,
                  max: 1000000,
                })}
                type="number"
                placeholder="500"
                style={{ borderColor: errors.price && 'red' }}
              />
            </div>
            <div className="meta-item order-dateRequired">
              Срок выполнения (дней)
              <input
                {...register('dateRequire', {
                  required: 'Укажите срок выполнения',
                  min: 1,
                  max: 90,
                })}
                type="number"
                placeholder="1 день"
                style={{ borderColor: errors.dateRequire && 'red' }}
              />
            </div>
            <button
              className="primary-button"
              type="submit"
              hidden={!authData}
              // disabled={!isValid}
            >
              <span>Создать заказ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
