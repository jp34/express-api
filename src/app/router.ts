import { Router } from "express";
import { authenticate } from "./middleware/auth";
import AuthController from "./controllers/auth.controller";
import AccountsController from "./controllers/accounts.controller";
import UsersController from "./controllers/users.controller";
import TagsController from "./controllers/tags.controller";
import PlacesController from "./controllers/places.controller";

const router = Router();
const auth = new AuthController();
const accounts = new AccountsController();
const users = new UsersController();
const tags = new TagsController();
const places = new PlacesController();

// Api Auth
router.post("/api/auth/login", auth.login);
router.post("/api/auth/signup", auth.signup);
router.post("/api/auth/signup/mobile", auth.mobileSignup);
router.post("/api/auth/refresh", auth.refresh);

// Accounts API
router.get("/api/accounts", authenticate, accounts.getMany);
router.get("/api/accounts/:uid", authenticate, accounts.getOne);
router.put("/api/accounts/:uid", authenticate, accounts.update);
router.delete("/api/accounts/:uid", authenticate, accounts.delete);

// Users API
router.post("/api/users/:uid", authenticate, users.create);
router.get("/api/users", authenticate, users.getMany);
router.get("/api/users/:uid", authenticate, users.getOne);
router.put("/api/users/:uid", authenticate, users.update);
router.delete("/api/users/:uid", authenticate, users.delete);
router.get("/api/users/:uid/interests", authenticate, users.getInterests);
router.put("/api/users/:uid/interests", authenticate, users.addInterests);
router.get("/api/users/:uid/friends", authenticate, users.getFriends);
router.get("/api/users/:uid/groups", authenticate, users.getGroups);
router.get("/api/users/:uid/inbox", authenticate, users.getInbox);
router.put("/api/users/:uid/inbox", authenticate, users.updateInbox);

// Tags API
router.post("/api/tags", authenticate, tags.create);
router.get("/api/tags", authenticate, tags.getMany);
router.get("/api/tags/:name", authenticate, tags.getOne);
router.put("/api/tags/:name", authenticate, tags.update);
router.delete("/api/tags/:name", authenticate, tags.delete);

// Places API
router.get("/api/places/search", authenticate, places.search);
router.get("/api/places/nearby", authenticate, places.nearby);

export default router;
