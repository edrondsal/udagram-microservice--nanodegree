"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8080;
    const feedMicroservice = process.env.FEED || 'http://localhost:8881';
    const usersMicroservice = process.env.USERS || 'http://localhost:8882';
    app.use(cors_1.default({
        allowedHeaders: [
            'Origin', 'X-Requested-With',
            'Content-Type', 'Accept',
            'X-Access-Token', 'Authorization',
        ],
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: 'http://localhost:8100',
    }));
    app.use('/api/v0/feed', express_http_proxy_1.default(feedMicroservice, {
        proxyReqPathResolver: req => new URL(req.baseUrl, feedMicroservice).pathname
    }));
    app.use('/api/v0/users', express_http_proxy_1.default(usersMicroservice, {
        proxyReqPathResolver: req => new URL(req.baseUrl, usersMicroservice).pathname
    }));
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // Root URI call
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send('/api/v0/');
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running ${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map