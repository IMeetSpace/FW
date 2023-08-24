import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './Orders.scss';

import axios from '../../axios';

import { fetchCategories, fetchOrders } from '../../redux/slices/orders';

import OrdersList from './OrdersList/OrdersList';
import Filters from './Filters/Filters';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, categories } = useSelector((state) => state.orders);

  const isOrdersLoading = orders.status === 'loading';
  const isCategoriesLoading = categories.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchCategories());
  }, []);

  return (
    <main className="orders">
      <h1 className="title">Биржа заказов</h1>
      <div className="content">
        <Filters
          categories={categories.items}
          isCategoriesLoading={isCategoriesLoading}
        />
        <OrdersList orders={orders.items} isOrdersLoading={isOrdersLoading} />
      </div>
    </main>
  );
};

export default Orders;
