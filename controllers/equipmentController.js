import database from "../services/database.js";
import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import equipmentSchema from "../models/equipment.js"

export async function getAllEquipment(req, res, next) {
    try {
        const params = {
            TableName: "equipment"
        }
        const command = new ScanCommand(params)
        const result = await database.send(command)
        res.status(200).json(result.Items)
    } catch (err) {
        next(err)
    }
}

export async function addEquipment(req, res, next) {
    try {

        // This idea would be to check if the equipment already exists first 
        // and then add to its amount if so

        // const getParams = {
        //     TableName: "equipment"
        // }
        // const getCommand = new ScanCommand(params)
        // const getResult = await database.send(command)

        // console.log(getResult)

        const uuid = uuidv4()
        req.body.id = uuid;
        req.body.amount = 1
        const { error, value } = equipmentSchema.validate(req.body)

        if (error) {
            res.status(400).json({ error: error.details[0].message })
            return
        }

        const { id, name, amount } = value

        const params = {
            TableName: "equipment",
            Item: {
                id,
                name,
                amount,
            }
        }

        const command = new PutCommand(params)

        await database.send(command)

        res.status(201).json({ message: "Successfully added new equipment", data: params.Item })
    } catch (err) {
        next(err)
    }


}