import { Router } from 'express';
import { registerUser, userLogin, logout, refreshAccessToken, changePassword, updateUserDetails, getCurrentUser } from '../controller/user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(userLogin);

//secure user routes 
router.route('/logout').post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/upadate-user-details").post(verifyJWT, updateUserDetails)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)


export default router;
