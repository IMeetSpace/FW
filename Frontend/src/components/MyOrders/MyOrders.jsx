import React from 'react';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './MyOrders.scss';

import axios from '../../axios';

import OrdersList from './OrdersList/OrdersList';
import { selectAuth } from '../../redux/slices/auth';

const MyOrders = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const navigate = useNavigate();

  const authData = useSelector(selectAuth);

  React.useEffect(() => {
    if (!authData) return;
    axios.get(`/orders/{"user": "${authData._id}"}`).then((res) => {
      setData(res.data);
      setIsLoading(false);
    });
  }, [authData]);

  return (
    <main className="my-orders">
      <h1 className="title">
        <span>Мои заказы</span>
        <button
          onClick={() => {
            navigate('/my-orders/create');
          }}
          className="primary-button"
          hidden={!authData}>
          Создать заказ
        </button>
      </h1>
      <div className="content">
        {!authData ? '' : <OrdersList orders={data} isOrdersLoading={isLoading} />}
      </div>
    </main>
  );
};

export default MyOrders;
