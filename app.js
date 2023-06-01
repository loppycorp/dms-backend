require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { logger } = require('./app/middlewares/logging.middleware');

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send({
        'status': 'success',
        'message': 'Welcome to Document Management System'
    });
});

require('./app/routes/driver_detail.routes.js')(app);
require('./app/routes/vehicle_detail.routes.js')(app);
require('./app/routes/department.routes.js')(app);
require('./app/routes/user.routes.js')(app);


const port = process.env.APP_PORT || 3200;
app.listen(port, () => logger.info(`Listening on port ${port}`));