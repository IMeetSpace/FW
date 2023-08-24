import React from 'react';
import { useSelector } from 'react-redux';

import './MyTenders.scss';

import axios from '../../axios';

import TendersList from './TendersList/TendersList';
import { selectAuth } from '../../redux/slices/auth';

const MyTenders = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const authData = useSelector(selectAuth);

  React.useEffect(() => {
    if (!authData) return;
    axios
      .get(`/tenders/{"user": "${authData._id}"}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('Ошибка при получении откликов');
      });
  }, [authData]);

  return (
    <main className="my-tenders">
      <h1 className="title">
        <span>Отклики</span>
      </h1>
      <div className="content">
        {!authData ? '' : <TendersList orders={data} isOrdersLoading={isLoading} />}
      </div>
    </main>
  );
};

export default MyTenders;
