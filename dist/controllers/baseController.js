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
const mongoose_1 = __importDefault(require("mongoose"));
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, owner } = req.query;
            const filter = {};
            if (senderId)
                filter.senderId = senderId;
            if (owner)
                filter.owner = owner;
            try {
                const items = yield this.model.find(filter);
                res.send(items);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                console.log(`Searching for comment with ID: ${id}`);
                const item = yield this.model.findById(id);
                if (item != null) {
                    res.send(item);
                }
                else {
                    res.status(404).send("not found");
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                const item = yield this.model.create(body);
                res.status(201).send(item);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid ID format" });
            }
            try {
                const rs = yield this.model.findByIdAndDelete(id);
                res.status(200).send(rs);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    getByQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, owner } = req.query;
            const query = {};
            if (senderId)
                query.senderId = senderId;
            if (owner)
                query.owner = owner;
            try {
                const posts = yield this.model.find(query);
                if (posts.length === 0) {
                    res.status(404).send("No posts found for the specified query");
                }
                else {
                    res.status(200).send(posts);
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updateData = req.body;
            try {
                const updatedItem = yield this.model.findByIdAndUpdate(id, updateData, { new: true });
                if (!updatedItem) {
                    res.status(404).send("Not found");
                }
                else {
                    res.status(200).send(updatedItem);
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    getByField(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fieldName = req.params.field;
            const fieldValue = req.query[fieldName];
            if (!fieldValue) {
                res.status(400).send(`Missing ${fieldName}`);
                return;
            }
            const query = { [fieldName]: fieldValue };
            try {
                const items = yield this.model.find(query);
                if (items.length === 0) {
                    res.status(404).send(`No ${fieldName} found for the specified value`);
                }
                else {
                    res.status(200).send(items);
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=baseController.js.map