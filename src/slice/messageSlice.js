import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: 'message',
  initialState: [
    //測試引入樣式及toast是否成功
    // {
    //   id: 1,
    //   type: 'success',
    //   title: '成功',
    //   text: 'test'      
    // }
  ],
  reducers: {  //建立action
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? 'success' : 'danger',
        title: action.payload.success ? '成功' : '失敗',
        text: action.payload.message
      })
    },
    removeMessage(state, action) {
      const index = state.findIndex((message) => message.id === action.payload);
      if(index !== -1) {
        state.splice(index,1);
      }
    }
  }
})

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',   //取唯一的名稱
  async (payload, {dispatch, requestId}) => {   //第一個參數傳進來的值，第二個參數常放dispath
    dispatch(
      createMessage({
        ...payload,
        id: requestId
      })
    );
    //2秒後移除message
    setTimeout(() => {
      dispatch(removeMessage(requestId));
    },2000);
  }
)
export const {createMessage, removeMessage} =messageSlice.actions;
export default messageSlice.reducer