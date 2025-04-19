"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const morgan_1 = __importDefault(require("morgan"));
const planets_js_1 = require("./controllers/planets.js");
const users_js_1 = require("./controllers/users.js");
const authorize_js_1 = __importDefault(require("./authorize.js"));
const multer_1 = __importDefault(require("multer"));
require("./passport.js");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use("/uploads", express_1.default.static("uploads"));
app.use("/static", express_1.default.static("static"));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/api/planets", planets_js_1.getAll);
app.get("/api/planets/:id", planets_js_1.getOneById);
app.post("/api/planets", planets_js_1.create);
app.put("/api/planets/:id", planets_js_1.updateById);
app.delete("/api/planets/:id", planets_js_1.deleteById);
app.post("/api/planets/:id/image", upload.single("image"), planets_js_1.createImage);
app.post("/api/users/login", users_js_1.logIn);
app.post("/api/users/signup", users_js_1.signUp);
app.get("/api/users/logout", authorize_js_1.default, users_js_1.logOut);
app.listen(port, () => {
    console.log(`Express app listening on port http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map