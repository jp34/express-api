import { Router } from "express";
import { authorize } from "../middleware/auth";
import AuthController from "./auth/auth.controller";
import AccountsController from "./resource/accounts.controller";
import TagsController from "./resource/tags.controller";

const router = Router();
const auth = new AuthController();
const accounts = new AccountsController();
const tags = new TagsController();

// Auth API
router.post("/auth/signup", auth.signup);
router.post("/auth/login", auth.login);
router.post("/auth/refresh", auth.refresh);

// Accounts API
router.get("/accounts", authorize, accounts.getMany);
router.get("/accounts/:id", authorize, accounts.getOne);
router.put("/accounts/:id", authorize, accounts.update);
router.delete("/accounts/:id", authorize, accounts.delete);

// Tags API
router.post("/tags", authorize, tags.create);
router.get("/tags", authorize, tags.getMany);
router.get("/tags/:id", authorize, tags.getOne);
router.put("/tags/:id", authorize, tags.update);
router.delete("/tags/:id", authorize, tags.delete);

export default router;
