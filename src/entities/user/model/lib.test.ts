import { buildSessionUser } from './lib';
import { DEMO_PAYLOADS, signMockToken } from '@/mocks/token';

describe('buildSessionUser', () => {
  it('собирает SessionUser из валидного токена', () => {
    const token = signMockToken(DEMO_PAYLOADS.STUDENT);

    expect(buildSessionUser(token)).toEqual(DEMO_PAYLOADS.STUDENT);
  });

  it('проставляет className=null, если в токене нет класса', () => {
    const token = signMockToken(DEMO_PAYLOADS.TEACHER);

    expect(buildSessionUser(token)).toEqual({
      id: 2,
      email: 'teacher1@school.local',
      role: 'TEACHER',
      className: null,
    });
  });

  it('возвращает null для невалидного токена', () => {
    expect(buildSessionUser('not-a-jwt')).toBeNull();
    expect(buildSessionUser('')).toBeNull();
  });
});
