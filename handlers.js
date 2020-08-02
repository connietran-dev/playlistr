const usersArray = [];

module.exports = {
    addUser: (roomId, user, socket) => {
        // Create user and set user room property to current roomId
        let currentUser = user;
        currentUser.room = roomId;
        // socket.id is used to removeUser upon 'disconnect'
        currentUser.socketId = socket.id;

        usersArray.push(currentUser);
    },

    getUsersInRoom: (currentRoom) => {
        // Filter usersArray for users who match currentRoom
        return usersArray.filter((user) => user.room === currentRoom);
    },

    removeUser: (socket) => {
        // Find index of current socket/user and use to remove user from usersArray
        let index = usersArray.findIndex((user) => user.socketId === socket.id);

        if (index !== -1) return usersArray.splice(index, 1)[0];
    }
}