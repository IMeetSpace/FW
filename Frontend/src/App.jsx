import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './scss/reseter.scss';
import './scss/components.scss';
import './scss/fontsImporter.scss';
import './scss/colors.scss';
import './App.scss';

import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

import Header from './components/Header/Header';
import Home from './components/Home/Home';

import Register from './components/Register/Register';
import Login from './components/Login/Login';

import Chat from './components/Chat/Chat';

import Orders from './components/Orders/Orders';
import FullOrder from './components/FullOrder/FullOrder';
import MyOrders from './components/MyOrders/MyOrders';
import CreateOrder from './components/CreateOrder/CreateOrder';
import MyFullOrder from './components/MyFullOrder/MyFullOrder';

import MyTenders from './components/MyTenders/MyTenders';
import FullTender from './components/FullTender/FullTender';

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="page-content">
        <div className="container">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Orders />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dialogs" element={<Chat />} />
            <Route path="/dialogs/:id" element={<Chat />} />

            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<FullOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:id" element={<MyFullOrder />} />
            <Route path="/my-orders/create" element={<CreateOrder />} />

            <Route path="/tenders" element={<MyTenders />} />
            <Route path="/tenders/:id" element={<FullTender />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
