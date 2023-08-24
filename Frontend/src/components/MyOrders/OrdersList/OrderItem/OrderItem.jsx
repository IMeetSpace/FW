import React from 'react';
import { NavLink } from 'react-router-dom';

import './OrderItem.scss';

import { getRemainingTime } from '../../../../utils/getRemainingTime';

const OrderItem = (props) => {
  var description = props.item.description;
  if (description.length > 300) {
    description = description.substring(0, 300) + '...';
  }

  let dateString = getRemainingTime(new Date(props.item.dateRequire), new Date());

  const status = props.item.status.name;

  return (
    <div className={`my-order-item`}>
      <NavLink to={`/my-orders/${props.item._id}`} className="order-header">
        <div className="order-title">{props.item.title}</div>
        <div className="order-price">{props.item.price} ₽</div>
      </NavLink>
      <div className="order-description">{description}</div>
      <div className="order-footer">
        <div className="order-meta">
          <div className="order-require">Осталось: {dateString}</div>
          <div className="order-views">Просмотры: {props.item.views}</div>
        </div>
        <div className="order-buttons">
          <div className={`order-status ${status}`}>{status}</div>
          <NavLink
            to={`/my-orders/${props.item._id}`}
            className="orderItem primary-button">
            <span>Информация</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
