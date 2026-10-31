import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { loginSchema, revokeSessionsSchema } from "../../validators/auth";

const router = Router();
const authController = new AuthController();

router.post("/login", validateBody(loginSchema), authController.login);
router.post(
  "/users/:id/revoke-sessions",
  requireAuth,
  validateBody(revokeSessionsSchema),
  authController.revokeSessions
);

export default router;
