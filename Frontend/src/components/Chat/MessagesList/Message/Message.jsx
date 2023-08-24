import React from 'react';

import './Message.scss';

import axios from '../../../../axios';
import { getFormattedText } from '../../../../utils/getFormattedText';
import { months } from '../../../../utils/getRemainingTime';

const Message = (props) => {
  if (props.isLoading === true) {
    return <div className="message loading"></div>;
  }

  const sender = props.item.sender;

  const image = <div className="image">{sender.nickname[0].toUpperCase()}</div>;

  const text = getFormattedText(props.item.text);

  const date = new Date(props.item.createdAt);

  const _months = months()[date.getMonth() + 1];
  const days = ('0' + date.getDate()).slice(-2);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    <>
      {image}
      <div className="main">
        <div className="message-header">
          <div className="nickname">{sender.nickname}</div>
          <div className="date">
            {days} {_months} в {hours}:{minutes}
          </div>
        </div>
        <div className="content">{text}</div>
      </div>
    </>
  );
};

export default Message;
