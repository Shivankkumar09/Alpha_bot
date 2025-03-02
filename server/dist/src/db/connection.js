"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.disconnectFromDatabase = disconnectFromDatabase;
const mongoose_1 = require("mongoose");
async function connectToDatabase() {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not defined");
        }
        await (0, mongoose_1.connect)(mongoUrl);
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not Connect To MongoDB");
    }
}
async function disconnectFromDatabase() {
    try {
        await (0, mongoose_1.disconnect)();
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect From MongoDB");
    }
}
//# sourceMappingURL=connection.js.map