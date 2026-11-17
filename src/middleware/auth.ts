import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getUserByUid } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'يرجى تسجيل الدخول للمتابعة (رمز المصادقة مفقود)',
      },
    });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'جلسة الدخول منتهية أو غير صالحة، يرجى إعادة تسجيل الدخول',
      },
    });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'مطلوب تسجيل الدخول بصلاحية المشرف',
      },
    });
  }

  try {
    const email = (req.user.email || '').toLowerCase();
    if (email === 'mekoogk@gmail.com' || (req.user as any).admin === true) {
      return next();
    }

    const dbUser = await getUserByUid(req.user.uid);
    if (dbUser && dbUser.role === 'admin') {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'هذه العملية مخصصة لإدارة مجمع النور المعتمدة فقط',
      },
    });
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'تعذر التحقق من صلاحيات الإدارة',
      },
    });
  }
};
