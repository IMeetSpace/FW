import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from '../../axios';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const { data } = await axios.get('/orders');
  return data;
});
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const { data } = await axios.get('/categories');
    return data;
  },
);

const initialState = {
  orders: {
    items: [],
    status: 'loading',
  },
  categories: {
    items: [],
    status: 'loading',
  },
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchOrders.pending]: (state) => {
      state.orders.items = [];
      state.orders.status = 'loading';
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.orders.items = action.payload;
      state.orders.status = 'loaded';
    },
    [fetchOrders.rejected]: (state) => {
      state.orders.items = [];
      state.orders.status = 'error';
    },
    [fetchCategories.pending]: (state) => {
      state.categories.items = [];
      state.categories.status = 'loading';
    },
    [fetchCategories.fulfilled]: (state, action) => {
      state.categories.items = action.payload;
      state.categories.status = 'loaded';
    },
    [fetchCategories.rejected]: (state) => {
      state.categories.items = [];
      state.categories.status = 'error';
    },
  },
});

export const ordersReducer = ordersSlice.reducer;
