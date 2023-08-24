import React from 'react';

import './OrdersList.scss';

import OrderItem from './OrderItem/OrderItem';

const OrdersList = (props) => {
  if (props.isOrdersLoading || props.isTendersLoading) {
    return (
      <div className="list empty">
        <h2>Идёт загрузка...</h2>
      </div>
    );
  }
  if (props.orders.length === 0) {
    return (
      <div className="list empty">
        <h2>Заказы не найдены!</h2>
        <h3>Попробуйте изменить параметры поиска</h3>
      </div>
    );
  }

  let ordersCopy = [...props.orders];
  return (
    <div className="list">
      {ordersCopy.reverse().map((item, index) => (
        <OrderItem key={index} item={item} />
      ))}
    </div>
  );
};

export default OrdersList;
