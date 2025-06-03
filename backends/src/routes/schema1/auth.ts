import * as express from "express";
import AuthController from "../../controllers/schema1/auth";
import { authenticateUser } from "../../middlewares/admin-middleware";

const useAuthRouter = express.Router();

useAuthRouter.post("/auth/login", AuthController.login);
useAuthRouter.get("/auth/me", authenticateUser, AuthController.getMe);

export default useAuthRouter;
