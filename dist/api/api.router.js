"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auth_controller_1 = __importDefault(require("./auth/auth.controller"));
const accounts_controller_1 = __importDefault(require("./resource/accounts.controller"));
const tags_controller_1 = __importDefault(require("./resource/tags.controller"));
const router = (0, express_1.Router)();
const auth = new auth_controller_1.default();
const accounts = new accounts_controller_1.default();
const tags = new tags_controller_1.default();
// Auth API
router.post("/auth/signup", auth.signup);
router.post("/auth/login", auth.login);
router.post("/auth/refresh", auth.refresh);
// Accounts API
router.get("/accounts", auth_1.authorize, accounts.getMany);
router.get("/accounts/:id", auth_1.authorize, accounts.getOne);
router.put("/accounts/:id", auth_1.authorize, accounts.update);
router.delete("/accounts/:id", auth_1.authorize, accounts.delete);
// Tags API
router.post("/tags", auth_1.authorize, tags.create);
router.get("/tags", auth_1.authorize, tags.getMany);
router.get("/tags/:id", auth_1.authorize, tags.getOne);
router.put("/tags/:id", auth_1.authorize, tags.update);
router.delete("/tags/:id", auth_1.authorize, tags.delete);
exports.default = router;
