import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

import './Dialogs.scss';

const Dialogs = (props) => {
  return (
    <div className="dialogs">
      <div className="search">
        <input type="text" placeholder="Поиск" />
      </div>
      <div className="dialogs-list">
        {props.isLoading ? (
          <div className="dialog-item">Идёт загрузка...</div>
        ) : (
          props.dialogs.map((item, index) => {
            const receiver = item.members.filter(
              (member) => member._id !== props.userId,
            )[0];

            let image = (
              <div className="image">{receiver.nickname[0].toUpperCase()}</div>
            );

            return (
              <NavLink
                to={`/dialogs/${item._id}`}
                className="dialog-item"
                key={index}>
                {image}
                <div className="content">
                  <div className="header">
                    <div className="nickname">{receiver.nickname}</div>
                  </div>
                  <div className="last-message"></div>
                </div>
              </NavLink>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dialogs;
