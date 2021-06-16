"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema_1 = require("./Schema");
const app = express_1.default();
app.get('/', (req, res) => {
    res.send('<h1>Connected visit please /graphql</h1>');
});
const apolloServer = new apollo_server_express_1.ApolloServer({
    schema: Schema_1.schema,
    context: ({ req, res }) => ({
        req,
        res,
    }),
});
apolloServer.applyMiddleware({
    app,
});
const PORT = process.env.PORT || 8000;
mongoose_1.default
    .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('MongoDB Connected');
    return app.listen(PORT);
})
    .then(() => {
    console.log(`Server running at PORT: ${PORT}`);
});
//# sourceMappingURL=index.js.map