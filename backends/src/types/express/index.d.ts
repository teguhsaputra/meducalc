import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}
