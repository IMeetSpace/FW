import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import './Chat.scss';

import axios from '../../axios';

import MessagesList from './MessagesList/MessagesList';
import Dialogs from './Dialogs/Dialogs';
import { selectAuth } from '../../redux/slices/auth';

const Chat = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const socket = React.useRef();

  const { id } = useParams();
  const authData = useSelector(selectAuth);

  React.useEffect(() => {
    socket.current = io('http://localhost:5555');
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    socket.current.emit('addUser', authData._id);
    socket.current.on('getUsers', (users) => {
      console.log('online:', users); // online users
    });
  }, [isLoading, id, authData]);

  React.useEffect(() => {
    if (!authData) return;
    axios
      .get(`/dialogs/${authData._id}`)
      .then((res) => {
        res.data.userId = authData._id;
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении диалогов');
      });
  }, [authData]);

  return (
    <main className="chat">
      <h1 className="title">Чаты</h1>
      <div className="content">
        <Dialogs dialogs={data} isLoading={isLoading} userId={authData?._id} />
        <MessagesList isLoading={isLoading} socket={socket} userId={authData?._id} />
      </div>
    </main>
  );
};

export default Chat;
