import type { TeacherProfile } from '../model/types';
import { baseApi } from '@/shared/api/baseApi';

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeacherProfile: build.query<TeacherProfile, number>({
      query: (teacherId) => `/teachers/${teacherId}`,
      providesTags: (_result, _error, teacherId) => [{ type: 'Teacher', id: teacherId }],
    }),
    assignClass: build.mutation<
      { teacherId: number; className: string },
      { teacherId: number; className: string }
    >({
      query: ({ teacherId, className }) => ({
        url: `/teachers/${teacherId}/classes`,
        method: 'POST',
        body: { className },
      }),
      invalidatesTags: ['Teacher'],
    }),
    removeClass: build.mutation<{ message: string }, { teacherId: number; className: string }>({
      query: ({ teacherId, className }) => ({
        url: `/teachers/${teacherId}/classes/${encodeURIComponent(className)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teacher'],
    }),
    assignSubject: build.mutation<
      { teacherId: number; subject: string },
      { teacherId: number; subject: string }
    >({
      query: ({ teacherId, subject }) => ({
        url: `/teachers/${teacherId}/subjects`,
        method: 'POST',
        body: { subject },
      }),
      invalidatesTags: ['Teacher'],
    }),
    removeSubject: build.mutation<{ message: string }, { teacherId: number; subject: string }>({
      query: ({ teacherId, subject }) => ({
        url: `/teachers/${teacherId}/subjects/${encodeURIComponent(subject)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teacher'],
    }),
  }),
});

export const {
  useGetTeacherProfileQuery,
  useAssignClassMutation,
  useRemoveClassMutation,
  useAssignSubjectMutation,
  useRemoveSubjectMutation,
} = teacherApi;
