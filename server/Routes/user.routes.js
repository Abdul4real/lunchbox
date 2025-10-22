// user.routes.js
import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/")
  .post(userCtrl.create)
  .get(userCtrl.list);

router.route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.route("/:userId/admin")
  .put(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.setAdmin);

router.route("/:userId/security")
  .put(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.updateSecurity);

router.route("/:userId/password")
  .put(authCtrl.requireSignin, authCtrl.canUpdateUser, userCtrl.updatePassword);

router.param("userId", userCtrl.userByID);

export default router;
