import { http, HttpResponse } from 'msw';

import { API_URL } from '@/shared/config/env';

import { teacherClasses, teacherSubjects, users } from '../db';
import { isRole, requireUser } from '../helpers';

const findTeacher = (teacherId: number) => {
  const teacher = users.find(
    (candidate) => candidate.id === teacherId && candidate.role === 'TEACHER',
  );
  return teacher ?? null;
};

const forbidden = () =>
  HttpResponse.json({ message: 'Недостаточно прав' }, { status: 403 });

const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });

export const teacherHandlers = [
  http.get(`${API_URL}/teachers/:teacherId`, ({ request, params }) => {
    const user = requireUser(request);
    if (!user) return forbidden();

    const teacherId = Number(params.teacherId);
    if (user.role !== 'ADMIN' && user.id !== teacherId) return forbidden();

    const teacher = findTeacher(teacherId);
    if (!teacher) return notFound('Учитель не найден');

    return HttpResponse.json({
      id: teacher.id,
      name: teacher.name,
      lastName: teacher.lastName,
      email: teacher.email,
      classes: teacherClasses
        .filter((link) => link.teacherId === teacherId)
        .map((link) => link.className),
      subjects: teacherSubjects
        .filter((link) => link.teacherId === teacherId)
        .map((link) => link.subject),
    });
  }),

  http.get(`${API_URL}/teachers/:teacherId/classes`, ({ request, params }) => {
    const user = requireUser(request);
    if (!user) return forbidden();

    const teacherId = Number(params.teacherId);
    if (user.role !== 'ADMIN' && user.id !== teacherId) return forbidden();

    return HttpResponse.json(
      teacherClasses.filter((link) => link.teacherId === teacherId),
    );
  }),

  http.post(`${API_URL}/teachers/:teacherId/classes`, async ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN')) return forbidden();

    const teacherId = Number(params.teacherId);
    if (!findTeacher(teacherId)) return notFound('Учитель не найден');

    const body = (await request.json()) as { className?: string };
    const className = body.className?.trim();
    if (!className) {
      return HttpResponse.json(
        { message: 'className обязателен' },
        { status: 400 },
      );
    }

    const exists = teacherClasses.some(
      (link) => link.teacherId === teacherId && link.className === className,
    );
    if (!exists) {
      teacherClasses.push({ teacherId, className });
    }

    return HttpResponse.json(
      { teacherId, className },
      { status: exists ? 200 : 201 },
    );
  }),

  http.delete(`${API_URL}/teachers/:teacherId/classes/:className`, ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN')) return forbidden();

    const teacherId = Number(params.teacherId);
    const className = String(params.className);
    const index = teacherClasses.findIndex(
      (link) => link.teacherId === teacherId && link.className === className,
    );

    if (index === -1) return notFound('Такой класс за учителем не закреплён');
    teacherClasses.splice(index, 1);

    return HttpResponse.json({ message: `Класс ${className} откреплён от учителя` });
  }),

  http.get(`${API_URL}/teachers/:teacherId/subjects`, ({ request, params }) => {
    const user = requireUser(request);
    if (!user) return forbidden();

    const teacherId = Number(params.teacherId);
    if (user.role !== 'ADMIN' && user.id !== teacherId) return forbidden();

    return HttpResponse.json(
      teacherSubjects.filter((link) => link.teacherId === teacherId),
    );
  }),

  http.post(`${API_URL}/teachers/:teacherId/subjects`, async ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN')) return forbidden();

    const teacherId = Number(params.teacherId);
    if (!findTeacher(teacherId)) return notFound('Учитель не найден');

    const body = (await request.json()) as { subject?: string };
    const subject = body.subject?.trim();
    if (!subject) {
      return HttpResponse.json({ message: 'subject обязателен' }, { status: 400 });
    }

    const exists = teacherSubjects.some(
      (link) => link.teacherId === teacherId && link.subject === subject,
    );
    if (!exists) teacherSubjects.push({ teacherId, subject });

    return HttpResponse.json(
      { teacherId, subject },
      { status: exists ? 200 : 201 },
    );
  }),

  http.delete(`${API_URL}/teachers/:teacherId/subjects/:subject`, ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN')) return forbidden();

    const teacherId = Number(params.teacherId);
    const subject = String(params.subject);
    const index = teacherSubjects.findIndex(
      (link) => link.teacherId === teacherId && link.subject === subject,
    );

    if (index === -1) return notFound('Такой предмет за учителем не закреплён');
    teacherSubjects.splice(index, 1);

    return HttpResponse.json({ message: `Предмет «${subject}» откреплён от учителя` });
  }),
];