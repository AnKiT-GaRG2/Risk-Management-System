// returnRoutes.js
import express from "express";
import { getAllReturns, updateReturn} from "../controllers/returnController.js";


const router = express.Router();

router.get("/", getAllReturns);
router.put("/:id", updateReturn);

export default router;
