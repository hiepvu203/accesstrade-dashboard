const campaignController = require("../controllers/campaignController");
const authMiddleware = require("../middleware/auth");

const router = require("express").Router();

router.post("/addCampaign", authMiddleware, campaignController.addCampaign);

router.get("/myCampaigns", authMiddleware, campaignController.getMyCampaigns);

module.exports = router;