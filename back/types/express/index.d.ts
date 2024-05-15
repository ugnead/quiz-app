import 'express';

declare module 'express-serve-static-core' {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Request {
    user?: User;
  }
}
