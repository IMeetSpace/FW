import { configureStore } from '@reduxjs/toolkit';

import { ordersReducer } from './slices/orders';
import { authReducer } from './slices/auth';

const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
  },
});

export default store;
