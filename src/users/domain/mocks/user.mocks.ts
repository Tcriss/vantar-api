
import { Role } from '../../application/enums';
import { UserEntity } from '../entities/user.entity';

export const userMock: UserEntity = {
  id: 'a4b1c2d3-4567-890a-bcde-fghij1234567',
  name: 'Alice Smith',
  email: 'alice.smith@example.com',
  active: true,
  refresh_token: '',
  role: Role.ADMIN,
  password: '$2b$12$KIX8H7JypTzRa7B5F5qWpu1bOCtYX5bHCQJ4L2g7hAl4oEGd6Xb92',
  created_at: new Date('2024-06-05T10:00:00Z'),
};

export const userMock1: UserEntity = {
  id: 'a4b1c2d3-4567-890a-bcde-fghij1234567',
  name: 'Amanda Rogers',
  email: 'alice.smith@example.com',
  active: true,
  refresh_token: '',
  role: Role.ADMIN,
  password: '$2b$12$KIX8H7JypTzRa7B5F5qWpu1bOCtYX5bHCQJ4L2g7hAl4oEGd6Xb92',
  created_at: new Date('2024-06-05T10:00:00Z'),
};

export const userMock2: UserEntity = {
  id: 'b5c2d3e4-5678-901a-bcde-fghij2345678',
  name: 'Bob Johnson',
  email: 'bob.johnson@example.com',
  active: true,
  refresh_token: '',
  role: Role.CUSTOMER,
  password: '$2b$12$QmS1K/X7I5H7/CB5V7P9u.eRtPfX6s6JFF9CJYy3FZ5QABw0cN3mK',
  created_at: new Date('2024-06-05T10:00:00Z'),
};

export const userMock3: UserEntity = {
  id: 'c6d3e4f5-6789-012a-bcde-fghij3456789',
  name: 'Bob Johnson',
  email: 'charlie.brown@example.com',
  active: true,
  refresh_token: '',
  role: Role.CUSTOMER,
  password: '$2b$12$QmS1K/X7I5H7/CB5V7P9u.eRtPfX6s6JFF9CJYy3FZ5QABw0cN3mK',
  created_at: new Date('2024-06-05T10:00:00Z'),
};

export const usersMock4: UserEntity = {
  id: 'c6d3e4f5-6789-012a-bcde-fghij3456789',
  name: 'Bob Johnson',
  email: 'charlie.brown@example.com',
  active: true,
  refresh_token: '',
  role: Role.CUSTOMER,
  password: '2b$12$QmS1K/X7I5H7/CB5V7P9u.eRtPfX6s6JFF9CJYy3FZ5QABw0cN3mK',
  created_at: new Date('2024-06-05T10:00:00Z'),
};

export const partialUserMock1: Partial<UserEntity> = {
  id: 'a4b1c2d3-4567-890a-bcde-fghij1234567',
  name: 'Alice Smith',
  role: Role.CUSTOMER,
  active: true
};

export const partialUserMock2: Partial<UserEntity> = {
  id: 'b5c2d3e4-5678-901a-bcde-fghij2345678',
  name: 'Bob Johnson',
  role: Role.CUSTOMER,
  active: true
};