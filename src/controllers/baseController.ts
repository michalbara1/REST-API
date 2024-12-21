import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
    model: Model<T>;
    constructor(model: any) {
        this.model = model;
    }

    async getAll(req: Request, res: Response) {
        const { senderId, owner } = req.query;  // Get sender and owner from query parameters
        const filter: Record<string, any> = {};

        if (senderId) filter.senderId = senderId;  // If sender is passed, filter by sender
        if (owner) filter.owner = owner;  // If owner is passed, filter by owner

        try {
            const items = await this.model.find(filter);  // Apply the filter to the model
            res.send(items);  // Return the filtered items
        } catch (error) {
            res.status(400).send(error);
        }
    }


    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            console.log(`Searching for comment with ID: ${id}`);
            const item = await this.model.findById(id);
            if (item != null) {
                res.send(item);
            } else {
                res.status(404).send("not found");
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async create(req: Request, res: Response) {
        const body = req.body;
        try {
            const item = await this.model.create(body);
            res.status(201).send(item);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async deleteItem(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const rs = await this.model.findByIdAndDelete(id);
            res.status(200).send(rs);
        } catch (error) {
            res.status(400).send(error);
        }
    };             

    async getByQuery(req: Request, res: Response): Promise<void> {
        const { senderId, owner } = req.query;
        const query: Record<string, any> = {};

        if (senderId) query.senderId = senderId;
        if (owner) query.owner = owner;
    
        try {
            const posts = await this.model.find(query); 
            if (posts.length === 0) {
                res.status(404).send("No posts found for the specified query");
            } else {
                res.status(200).send(posts);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    };

    async update(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const updateData = req.body;
        try {
            const updatedItem = await this.model.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedItem) {
                res.status(404).send("Not found");
            } else {
                res.status(200).send(updatedItem);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async getByField(req: Request, res: Response): Promise<void> { // for get comment by post id
        const fieldName = req.params.field; 
        const fieldValue = req.query[fieldName];

        if (!fieldValue) {
            res.status(400).send(`Missing ${fieldName}`);
            return;
        }
        const query: Record<string, any> = { [fieldName]: fieldValue };
        try {
            const items = await this.model.find(query);
            if (items.length === 0) {
                res.status(404).send(`No ${fieldName} found for the specified value`);
            } else {
                res.status(200).send(items);
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
}


export default BaseController