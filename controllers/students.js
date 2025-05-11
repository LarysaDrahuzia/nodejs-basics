import { getAllStudents, getStudentById } from '../services/students.js';
import createHttpError from 'http-errors'; // 1. Імпортуємо функцію з бібліотеки

export const getStudentsController = async (req, res, next) => {
  const students = await getAllStudents();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentByIdController = async (req, res) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    // 2. Створюємо та налаштовуємо помилку
    throw createHttpError(404, 'Student not found');
  }
  res.json({
    status: 200,
    message: `Successfully found student with id: ${studentId}!`,
    data: student,
  });
};
