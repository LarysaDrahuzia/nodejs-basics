import { StudentsCollection } from '../db/models/student.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }

  //Логіка по фільтрації таким чином одночасно застосовується як до основного запиту
  // studentsQuery, так і до запиту для обрахунку кількості studentsCount
  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};

export const createStudent = async (payload) => {
  const student = await StudentsCollection.create(payload);
  return student;
};

export const deleteStudent = async (studentId) => {
  const student = await StudentsCollection.findOneAndDelete({ _id: studentId });
  return student;
};

export const updateStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    {
      _id: studentId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

// Опція includeResultMetadata визначає тип повернення складених методів.

// Цей параметр за замовчуванням має значення false, що означає, що кожен метод повертає знайдений документ. Якщо документ не знайдено, кожен метод повертає значення null. Якщо встановити includeResultMetadata на true, метод повертає тип ModifyResult, який містить знайдений документ і метадані.

// Вбудований документ lastErrorObject містить такі поля:

// n (ціле число) – містить кількість документів, що відповідають предикату оновлення, або кількість документів, які команда вставила або видалила.

// updatedExisting (логічне значення) – Містить значення true, якщо операція оновлення:
// - оновила існуючий документ.
// - документ знайдено, але він вже перебував у бажаному стані призначення, тому оновлення фактично не відбулося.

// upserted (документ) – Містить ObjectId вставленого документа, якщо операція оновлення з upsert: true призвела до створення нового документа.
