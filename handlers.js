const usersArray = [];

module.exports = {
	addUser: (roomId, user, socket) => {
		// Create user and set user room property to current roomId
		const currentUser = { ...user };
		currentUser.room = roomId;
		currentUser.socketId = socket.id;

		if (!usersArray.filter(item => item.socketId === currentUser.socketId)[0])
			usersArray.push(currentUser);
	},

	getUsersInRoom: currentRoom =>
		usersArray.filter(user => user.room === currentRoom),

	removeUser: socket => {
		// Find index of current socket/user and use to remove user from usersArray
		const index = usersArray.findIndex(user => user.socketId === socket.id);

		if (index !== -1) return usersArray.splice(index, 1)[0];
	}
};
