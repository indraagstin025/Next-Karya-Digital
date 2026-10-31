import { Router } from "express";
import { MediaController, uploadMiddleware } from "../../controllers/media.controller";
import { requireAuth } from "../../middlewares/auth";

const router = Router();
const mediaController = new MediaController();

router.use(requireAuth);

router.get("/", mediaController.getMedia);
router.post("/", uploadMiddleware.single("file"), mediaController.uploadMedia);
router.delete("/:id", mediaController.deleteMedia);

export default router;
