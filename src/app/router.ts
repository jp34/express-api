import { Router } from "express";
import { authorize } from "./middleware/auth";
import TagsController from "./controllers/tags.controller";

const router = Router();
const tags = new TagsController();

// Tags API
router.post("/tags", authorize, tags.create);
router.get("/tags", authorize, tags.getMany);
router.get("/tags/:id", authorize, tags.getOne);
router.put("/tags/:id", authorize, tags.update);
router.delete("/tags/:id", authorize, tags.delete);

export default router;
