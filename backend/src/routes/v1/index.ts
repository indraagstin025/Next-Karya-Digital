import { Router } from "express";
import publicRoutes from "./public.routes";
import authRoutes from "./auth.routes";
import cmsRoutes from "./cms.routes";
import crmRoutes from "./crm.routes";
import mediaRoutes from "./media.routes";
import analyticsRoutes from "./analytics.routes";
import emergencyRoutes from "./emergency.routes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Next Karya Digital Solutions API Core",
      version: "1.0.0",
    },
    meta: null,
    error: null,
  });
});

// Mount modular sub-routers
router.use("/", publicRoutes);
router.use("/auth", authRoutes);
router.use("/", cmsRoutes);
router.use("/crm", crmRoutes);
router.use("/media", mediaRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/emergency", emergencyRoutes);

export default router;
