import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import {showToast} from '../../utils/common';

export const getComplain = createAsyncThunk('/ticket/form', async () => {
  try {
    const result = await axiosInstance.get(`/ticket/form`);
    return result?.data?.form;
  } catch (error) {
    showToast('Error!', error, 'error');
    return error.response;
  }
});

export const registerComplain = createAsyncThunk('/ticket', async data => {
  try {
    const result = await axiosInstance.post(`/ticket`, data);
    return result?.data?.data;
  } catch (error) {
    showToast('Error!', error, 'error');
    return error;
  }
});
