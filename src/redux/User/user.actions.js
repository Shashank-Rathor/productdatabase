import userTypes from './user.types';

export const setUser = user => ({
  type: userTypes.SET_USER,
  payload: user
})
