const app = require('./app');
const { sequelize } = require('./config/db');
require('dotenv').config();

const config = require('./config/config');


const PORT = config.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
