import { isHttpError } from 'http-errors'; // Імпортуємо клас HttpError для обробки помилок HTTP з відповідними статус-кодами

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (isHttpError(err) === true) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};

// err instanceof HttpError — це перевірка в JavaScript або TypeScript, яка визначає, чи є змінна err екземпляром класу HttpError.

// Що це означає?
// instanceof — оператор, який перевіряє, чи створено об'єкт за допомогою конкретного конструктора (тобто класу).

// HttpError — це клас, який зазвичай розширює стандартний клас Error і додає інформацію, специфічну для HTTP (наприклад, код статусу, повідомлення тощо).
