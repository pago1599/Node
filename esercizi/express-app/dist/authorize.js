"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const authorize = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (!user || err) {
            res.status(401).json({ msg: "Unauthorized." });
        }
        else {
            req.user = user;
            next();
        }
    })(req, res, next);
};
exports.default = authorize;
//# sourceMappingURL=authorize.js.map