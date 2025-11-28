const { getAllUsers } = require('../models/User');

const getUsers = async (req, res) => {
    try {
        console.log('GET /api/usuarios - Fetching all users');
        const users = await getAllUsers();
        console.log(`Found ${users.length} users`);
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
};

module.exports = getUsers;