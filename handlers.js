const usersArray = [];

module.exports = {
    addUser: (roomId, user) => {
        // Create user and set user room property to current roomId
        let currentUser = user;
        currentUser.room = roomId;

        usersArray.push(currentUser);
        console.log('Current user array: ', usersArray);
    }
}