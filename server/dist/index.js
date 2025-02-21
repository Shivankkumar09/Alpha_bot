"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./src/app.js"));
const connection_js_1 = require("./src/db/connection.js");
const PORT = process.env.PORT || 3000;
app_js_1.default.get("/", (req, res) => {
    res.send("Hello World");
});
(0, connection_js_1.connectToDatabase)()
    .then(() => {
    app_js_1.default.listen(PORT, () => console.log("Server Open & Connected To Database 🤟"));
})
    .catch((err) => console.log(err));
//# sourceMappingURL=index.js.map