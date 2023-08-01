import { Router } from "express";
import { authenticate } from "./middleware/auth";
import AuthController from "./controllers/auth.controller";
import AccountsController from "./controllers/accounts.controller";
import UsersController from "./controllers/users.controller";
import TagsController from "./controllers/tags.controller";
import PlacesController from "./controllers/places.controller";

const router = Router();

// ---- Auth --------
const auth = new AuthController();
router.post("/api/auth/login", auth.login);
router.post("/api/auth/signup", auth.signup);
router.post("/api/auth/refresh", auth.refresh);

// ---- Accounts --------
const accounts = new AccountsController();
router.get("/api/accounts", authenticate, accounts.getMany);
router.get("/api/accounts/:id", authenticate, accounts.getOne);
router.put("/api/accounts/:id", authenticate, accounts.update);
router.delete("/api/accounts/:id", authenticate, accounts.delete);

// ---- Users --------
const users = new UsersController();
router.post("/api/users/:id", authenticate, users.create);
router.get("/api/users", authenticate, users.getMany);
router.get("/api/users/:id", authenticate, users.getOne);
router.put("/api/users/:id", authenticate, users.update);
router.delete("/api/users/:id", authenticate, users.delete);
router.get("/api/users/:id/interests", authenticate, users.getInterests);
router.put("/api/users/:id/interests", authenticate, users.addInterests);
router.get("/api/users/:id/friends", authenticate, users.getFriends);
router.get("/api/users/:id/groups", authenticate, users.getGroups);
router.get("/api/users/:id/inbox", authenticate, users.getInbox);

// ---- Tags --------
const tags = new TagsController();
router.post("/api/tags", authenticate, tags.create);
router.get("/api/tags", authenticate, tags.getMany);
router.get("/api/tags/:name", authenticate, tags.getOne);
router.put("/api/tags/:name", authenticate, tags.update);
router.delete("/api/tags/:name", authenticate, tags.delete);

// ---- Places --------
const places = new PlacesController();
router.get("/api/places/search", authenticate, places.search);
router.get("/api/places/nearby", authenticate, places.nearby);

export default router;
