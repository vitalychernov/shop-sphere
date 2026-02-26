import { AuthService } from '../../src/services/auth.service';
import { User } from '../../src/models/user.model';
import bcrypt from 'bcryptjs';
import { AppError } from '../../src/utils/AppError';

// Mock the entire User model — we test service logic, not Mongoose
jest.mock('../../src/models/user.model');
jest.mock('bcryptjs');

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  role: 'customer' as const,
  toString: () => '507f1f77bcf86cd799439011',
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── register ───────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should create a user and return a token', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null); // no existing user
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(User.create).toHaveBeenCalledTimes(1);

      // Ensure we never store the plain text password
      const createCall = (User.create as jest.Mock).mock.calls[0][0];
      expect(createCall.passwordHash).toBe('hashed_password');
      expect(createCall.password).toBeUndefined();
    });

    it('should throw 409 if email is already taken', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser); // user exists

      await expect(
        AuthService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);

      await expect(
        AuthService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  // ─── login ──────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw 401 for wrong password', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // wrong password

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrong_password',
        })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 401 if user does not exist', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Same error message as wrong password — prevents email enumeration
      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
