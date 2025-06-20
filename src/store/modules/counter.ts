import { createSlice } from "@reduxjs/toolkit"

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 100,
    name: "hahaha",
  },
  reducers: {},
})

export default counterSlice.reducer
