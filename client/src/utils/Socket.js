import apiUrl from '../apiConfig';
import { io } from 'socket.io-client';

// const ENDPOINT = apiUrl;
// const socket = io(ENDPOINT);
console.log(apiUrl);
export const socket = io(apiUrl);
