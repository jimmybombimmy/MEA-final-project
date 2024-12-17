import database from "../services/database.js";
import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import userSchema from "../models/user.js";

export async function getAllUsers(req, res, next) {
    try {
        const params = {
            TableName: "users"
        }
        const command = new ScanCommand(params)
        const result = await database.send(command)
        res.status(200).json(result.Items)
    } catch (err) {
        next(err)
    }
}

export async function createUser(req, res, next) {
    try {
        const uuid = uuidv4()
        req.body.id = uuid;
        const { error, value } = userSchema.validate(req.body)

        if (error) {
            res.status(400).json({ error: error.details[0].message })
            return
        }

        const { id, username, equipment } = value

        const params = {
            TableName: "users",
            Item: {
                id,
                username,
                equipment
            }
        }

        const command = new PutCommand(params)

        await database.send(command)

        res.status(201).json({ message: "Successfully created user", data: params.Item })
    } catch (err) {
        next(err)
    }


}

export async function getUserById(req, res) {
    const userId = req.params.id;
    try {
        const params = {
            TableName: "users",
            Key: { id: userId },
        };
        const command = new GetCommand(params);
        const result = await database.send(command);
        if (!result.Item) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(result.Item);
    } catch (err) {
        next(err);
    }
}

export async function returnUserEquipmentById(req, res, next) {
    try {
        const userId = req.params.id;
        req.body.id = userId;
        const { error, value } = userSchema.validate(req.body)

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { username } = value

        const getParams = {
            TableName: "users",
            Key: { id: userId }
        }

        const getCommand = new GetCommand(getParams)

        const result = await database.send(getCommand)

        const user = result.Item

        if (!user) {
            return res.status(404).json({ message: "No user found" })
        }

        const updateParams = {
            TableName: "users",
            Key: { id: userId },
            UpdateExpression: "set #equipment = :equipment, #username = :username  ",
            ExpressionAttributeNames: {
                "#equipment": "equipment",
                "#username": "username",
            },
            ExpressionAttributeValues: {
                ":equipment": "none",
                ":username": username,
            },
            ReturnValues: "ALL_NEW",
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedUser = await database.send(updateCommand)

        res.status(200).json(updatedUser.Attributes)
    } catch (err) {
        next(err)
    }

    //return equipment to equipments table

}

export function retrieveUserEquipmentById(req, res) {
    //retrieve equipment by equipment id
}

export async function deleteUserById(req, res) {
    const userId = req.params.id;
    try {
        const params = {
            TableName: "users",
            Key: { id: userId },
        };
        const command = new DeleteCommand(params);
        await database.send(command);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

