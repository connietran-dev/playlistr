import { io } from 'socket.io-client';

const prodURL = 'https://playlistr-io.herokuapp.com';
const devURL = 'http://localhost:8888';

export const socket = io(window.location.hostname === 'localhost' ? devURL : prodURL);
