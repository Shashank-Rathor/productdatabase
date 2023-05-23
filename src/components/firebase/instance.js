import axios from 'axios';

export default axios.create({
  baseURL: "https://productmanagement-55fd8.firebaseio.com/"
})
