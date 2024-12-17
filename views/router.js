import express from "express";
const Router = express.Router();

import { getAllUsers, createUser, getUserById, returnUserEquipmentById, deleteUserById } from "../controllers/usersController.js";
import { addEquipment, getAllEquipment } from "../controllers/equipmentController.js";


Router.route("/users")
    .get(getAllUsers)
    .post(createUser)

Router.route("/user/:id")
    .get(getUserById)
    .delete(deleteUserById)

Router.route("/user/:id/return")
    .put(returnUserEquipmentById)

Router.route("/equipment")
    .get(getAllEquipment)
    .post(addEquipment)

export default Router;