import { Router } from "express";
import { authorize } from "./middleware/auth";
import AuthController from "./controllers/auth.controller";
import AccountsController from "./controllers/accounts.controller";
import UsersController from "./controllers/users.controller";
import TagsController from "./controllers/tags.controller";

const router = Router();
const auth = new AuthController();
const accounts = new AccountsController();
const users = new UsersController();
const tags = new TagsController();

// Api Auth
router.post("/api/auth/login", auth.login);
router.post("/api/auth/signup", auth.signup);
router.post("/api/auth/refresh", auth.refresh);

// Accounts API
router.get("/api/accounts", authorize, accounts.getMany);
router.get("/api/accounts/:uid", authorize, accounts.getOne);
router.put("/api/accounts/:uid", authorize, accounts.update);
router.delete("/api/accounts/:uid", authorize, accounts.delete);

// Users API
router.post("/api/users", authorize, users.create);
router.get("/api/users", authorize, users.getMany);
router.get("/api/users/:uid", authorize, users.getOne);
router.put("/api/users/:uid", authorize, users.update);
router.delete("/api/users/:uid", authorize, users.delete);

// Tags API
router.post("/api/tags", authorize, tags.create);
router.get("/api/tags", authorize, tags.getMany);
router.get("/api/tags/:name", authorize, tags.getOne);
router.put("/api/tags/:name", authorize, tags.update);
router.delete("/api/tags/:name", authorize, tags.delete);

export default router;
