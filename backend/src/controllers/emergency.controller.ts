import { Request, Response, NextFunction } from "express";
import { EmergencyService } from "../services/emergency.service";
import { sendSuccess } from "../utils/response";

const emergencyService = new EmergencyService();

export class EmergencyController {
  async unpublishContent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.unpublishContent({
        ...req.body,
        executedById: req.user!.id,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async lockContactForm(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.lockContactForm({
        ...req.body,
        executedById: req.user!.id,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async unlockContactForm(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.unlockContactForm({
        ...req.body,
        executedById: req.user!.id,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async setAlertBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await emergencyService.setAlertBanner({
        ...req.body,
        executedById: req.user!.id,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async reassignLead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await emergencyService.reassignLead(id, {
        ...req.body,
        executedById: req.user!.id,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
