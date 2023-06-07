import { Router } from "express";
import { authorize } from "./middleware/auth";
import AuthController from "./controllers/auth.controller";
import TagsController from "./controllers/tags.controller";
import AccountsController from "./controllers/accounts.controller";

const router = Router();
const auth = new AuthController();
const accounts = new AccountsController();
const tags = new TagsController();

// Api Auth
router.post("/api/auth/login", auth.login);
router.post("/api/auth/signup", auth.signup);
router.post("/api/auth/refresh", auth.refresh);

// Accounts API
router.get("/api/accounts", authorize, accounts.getMany);
router.get("/api/accounts/:id", authorize, accounts.getOne);
router.put("/api/accounts/:id", authorize, accounts.update);
router.delete("/api/accounts/:id", authorize, accounts.delete);

// Tags API
router.post("/tags", authorize, tags.create);
router.get("/tags", authorize, tags.getMany);
router.get("/tags/:id", authorize, tags.getOne);
router.put("/tags/:id", authorize, tags.update);
router.delete("/tags/:id", authorize, tags.delete);

export default router;
