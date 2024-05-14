require('express-async-errors');
const express = require('express');
const AppError = require('./utils/AppError');
const routes = require('./routes');

const app = express();
const port = 3333;

app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
  console.error(error);

  if (error instanceof AppError)
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(port, () => console.log(`Server running on port ${port}...`));
