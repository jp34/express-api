"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const tags_controller_1 = __importDefault(require("./controllers/tags.controller"));
const router = (0, express_1.Router)();
const tags = new tags_controller_1.default();
// Tags API
router.post("/tags", auth_1.authorize, tags.create);
router.get("/tags", auth_1.authorize, tags.getMany);
router.get("/tags/:id", auth_1.authorize, tags.getOne);
router.put("/tags/:id", auth_1.authorize, tags.update);
router.delete("/tags/:id", auth_1.authorize, tags.delete);
exports.default = router;
