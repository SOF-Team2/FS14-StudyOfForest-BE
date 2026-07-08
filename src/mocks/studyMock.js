// mock/studies.js
import { hashPassword } from '../utils/password.js';

export const createMockStudies = async () => {
  return [
    {
      nickname: '현지',
      name: 'React 스터디',
      description: 'React를 함께 공부하는 스터디입니다.',
      background: 'green',
      password_hash: await hashPassword('1234'),
      point: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
    {
      nickname: '도돈보',
      name: 'Node.js 스터디',
      description: 'Node.js와 Express를 공부합니다.',
      background: 'blue',
      password_hash: await hashPassword('5678'),
      point: 10,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  ];
};