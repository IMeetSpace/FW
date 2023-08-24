import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import './MessagesList.scss';

import axios from '../../../axios';

import Message from './Message/Message';
import { selectAuth } from '../../../redux/slices/auth';

const MessagesList = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [newMessage, setNewMessage] = React.useState('');
  const [lastMessage, setLastMessage] = React.useState(null);

  const authData = useSelector(selectAuth);

  const { id } = useParams();

  const scrollRef = React.useRef();

  React.useEffect(() => {
    if (isLoading) return;
    props.socket.current.on('getMessage', (data) => {
      setLastMessage(data);
    });
  }, [lastMessage, isLoading]);

  React.useEffect(() => {
    lastMessage && true && setData((prev) => [...prev, lastMessage]);
  }, [lastMessage, id]);

  React.useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'instant' });
  }, [data]);

  React.useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/messages/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении диалогов');
      });
  }, [id]);

  if (!id) {
    return (
      <div className="list empty">
        <h2>Выберите чат</h2>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="list empty">
        <h2>Идёт загрузка...</h2>
      </div>
    );
  }

  let image = <div className="image">T</div>;

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = (e) => {
    if (!newMessage) return;
    e.preventDefault();
    const message = {
      chat: id,
      sender: authData._id,
      text: newMessage,
    };

    axios
      .post('/messages', message)
      .then((res) => {
        res.data.sender = authData;
        setData([...data, res.data]);
        setNewMessage('');

        const receiverId = res.data.chat.members.find(
          (member) => member !== authData._id,
        );

        props.socket.current.emit('sendMessage', {
          ...res.data,
          receiverId,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="list">
      <div className="header">
        {image}
        <div className="content">
          <div className="nickname">TEST</div>
          <div className="last-online">online</div>
        </div>
      </div>
      <div className="messages-list">
        {data.map((item, index) => (
          <div className="message" key={index} ref={scrollRef}>
            <Message key={index} item={item} />
          </div>
        ))}
      </div>
      <div className="new-message">
        <svg
          className="add-file"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none">
          <path d="M20.363 10.27v11.54c0 2.28-1.67 4.308-3.938 4.527-2.607.25-4.788-1.79-4.788-4.34V8.515c0-1.43 1.025-2.727 2.443-2.87a2.73 2.73 0 0 1 3.011 2.716v11.453c0 .6-.49 1.09-1.09 1.09s-1.09-.49-1.09-1.09V10.27c0-.447-.37-.818-.818-.818s-.818.37-.818.818v9.39c0 1.43 1.025 2.727 2.443 2.87 1.636.164 3.01-1.112 3.01-2.716V8.548c0-2.28-1.67-4.308-3.938-4.527C12.193 3.77 10 5.8 10 8.362v13.384c0 3.13 2.29 5.934 5.4 6.228C19 28.3 22 25.51 22 21.997V10.27c0-.447-.37-.818-.818-.818s-.818.37-.818.818z"></path>
        </svg>
        <textarea
          className="text"
          type="text"
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={handleChange}
        />
        <svg
          onClick={sendMessage}
          className={`send-message ${newMessage ? 'valid' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none">
          <path d="M10.785 27.026L30.84 16.088a.1.1 0 0 0 0-.176L10.785 4.974c-.638-.348-1.372.266-1.142.955l.827 2.482a24 24 0 0 1 1.155 5.675l9.88 1.347c.284.04.495.28.495.568s-.212.53-.495.567l-9.88 1.347c-.154 1.92-.54 3.825-1.155 5.675l-.827 2.482c-.23.69.504 1.303 1.142.955z"></path>
        </svg>
      </div>
    </div>
  );
};

export default MessagesList;
