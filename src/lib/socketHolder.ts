let socket = null;

export default {
  getSocket: () => socket,
  setSocket: (s) => {
    socket = s;
  }
};
