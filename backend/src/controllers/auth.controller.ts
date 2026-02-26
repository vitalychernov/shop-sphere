import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    // Validate request body — throws ZodError with details if invalid
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    const data = await AuthService.register(result.data);

    res.status(201).json(data);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(result.error.errors[0].message, 400);
    }

    const data = await AuthService.login(result.data);

    res.status(200).json(data);
  }),
};
