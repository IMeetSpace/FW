import React from 'react';
import { NavLink } from 'react-router-dom';

import './TendersList.scss';

import TenderItem from './TenderItem/TenderItem';

const TendersList = (props) => {
  if (props.isOrdersLoading) {
    return (
      <div className="list empty">
        <h2>Идёт загрузка...</h2>
      </div>
    );
  }
  if (props.orders.length === 0) {
    return (
      <div className="list empty">
        <h2>Отклики не найдены!</h2>
        <h3>
          Найдите свой первый заказ{' '}
          <NavLink to={'/orders'}>
            <span>здесь</span>
          </NavLink>
        </h3>
      </div>
    );
  }
  return (
    <div className="list">
      {props.orders.reverse().map((item, index) => (
        <TenderItem key={index} item={item} />
      ))}
    </div>
  );
};

export default TendersList;
