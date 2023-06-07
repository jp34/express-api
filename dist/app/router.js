"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const tags_controller_1 = __importDefault(require("./controllers/tags.controller"));
const accounts_controller_1 = __importDefault(require("./controllers/accounts.controller"));
const router = (0, express_1.Router)();
const auth = new auth_controller_1.default();
const accounts = new accounts_controller_1.default();
const tags = new tags_controller_1.default();
// Api Auth
router.post("/api/auth/login", auth.login);
router.post("/api/auth/signup", auth.signup);
router.post("/api/auth/refresh", auth.refresh);
// Accounts API
router.get("/api/accounts", auth_1.authorize, accounts.getMany);
router.get("/api/accounts/:id", auth_1.authorize, accounts.getOne);
router.put("/api/accounts/:id", auth_1.authorize, accounts.update);
router.delete("/api/accounts/:id", auth_1.authorize, accounts.delete);
// Tags API
router.post("/tags", auth_1.authorize, tags.create);
router.get("/tags", auth_1.authorize, tags.getMany);
router.get("/tags/:id", auth_1.authorize, tags.getOne);
router.put("/tags/:id", auth_1.authorize, tags.update);
router.delete("/tags/:id", auth_1.authorize, tags.delete);
exports.default = router;
