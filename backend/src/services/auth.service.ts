import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const SALT_ROUNDS = 12;

export const AuthService = {
  async register(input: RegisterInput) {
    // Check if email is already taken
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    // Hash the password — never store plain text
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(input: LoginInput) {
    // Find user by email
    const user = await User.findOne({ email: input.email });

    // Use a generic error message — don't reveal whether email exists
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};
