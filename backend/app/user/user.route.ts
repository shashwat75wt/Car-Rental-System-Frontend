import { Router } from "express";
import passport from "passport";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from "../common/middleware/role-auth.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     description: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data provided
 */
router
    .post("/register", userValidator.createUser, catchError, userController.createUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router
    .post("/login", userValidator.login, catchError, passport.authenticate('login', { session: false }), userController.login)

/**
 * @swagger
 * /refreshToken:
 *   post:
 *     description: Refresh access token using refresh token
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid refresh token
 */
router
    .post("/refreshToken", userValidator.refreshToken, catchError, userController.refreshToken)

/**
 * @swagger
 * /me:
 *   get:
 *     description: Get current user info
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router
    .get("/me", roleAuth(['USER']), userController.getUserInfo)

/**
 * @swagger
 * /logout:
 *   post:
 *     description: Logout the current user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router
    .post("/logout", roleAuth(['USER']), userController.logout)

/**
 * @swagger
 * /{id}:
 *   delete:
 *     description: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
router
    .delete("/:id", roleAuth(['USER']), userController.deleteUser)

/**
 * @swagger
 * /{id}:
 *   patch:
 *     description: Edit user information
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditUser'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       400:
 *         description: Invalid data provided
 *       404:
 *         description: User not found
 */
router
    .patch("/:id", roleAuth(['ADMIN', 'USER']), userValidator.editUser, catchError, userController.editUser)

export default router;
