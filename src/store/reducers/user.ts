import { IUser } from '@/api/types/user'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  user?: IUser | null
}

const initialState: UserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload
    }
  }
})

export const { setUserInfo } = userSlice.actions

export default userSlice.reducer
