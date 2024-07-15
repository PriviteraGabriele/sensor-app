const users = [];

const addUser = (username) => {
    users.push(username);
};

const findUser = (username) => {
    return users.includes(username);
};

module.exports = { users, addUser, findUser };
