const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const authRouter = require('./routes/auth');
const swaggerDoc = require('./fixtures/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'false', message: '無此路由資訊' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ err: err.name, message: err.message });
});

module.exports = app;