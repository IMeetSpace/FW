import React from 'react';
import { NavLink } from 'react-router-dom';

import './TenderItem.scss';

import { getRemainingTime } from '../../../../utils/getRemainingTime';

const TenderItem = (props) => {
  if (props.isLoading === true) {
    return <div className="order-item loading"></div>;
  }

  var description = props.item.order.description;
  if (description.length > 300) {
    description = description.substring(0, 300) + '...';
  }

  let dateString = getRemainingTime(
    new Date(props.item.order.dateRequire),
    new Date(),
  );

  const status = props.item.status.name;

  return (
    <div className="my-tender-item">
      <NavLink to={`/tenders/${props.item._id}`} className="order-header">
        <div className="order-title">{props.item.order.title}</div>
        <div className="order-price">{props.item.order.price} ₽</div>
      </NavLink>
      <div className="order-description">{description}</div>
      <div className="order-footer">
        <div className="order-meta">
          <div className="order-require">Осталось: {dateString}</div>
          <div className="order-views">Просмотры: {props.item.order.views}</div>
        </div>
        <div className="order-buttons">
          <div className={`order-status ${status}`}>{status}</div>
          <NavLink
            to={`/tenders/${props.item._id}`}
            className="orderItem primary-button">
            <span>Информация</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TenderItem;
