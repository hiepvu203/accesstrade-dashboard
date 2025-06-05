const Campaign = require('../models/Campaign');

const campaignController = {
    addCampaign: async (req, res) => {
        try {
            const { name, category, targetUrl, commission, description, startDate, endDate, status } = req.body;
            const createdBy = req.user.id; // Lấy user id từ token

            const newCampaign = new Campaign({
                name,
                category,
                targetUrl,
                commission,
                description,
                startDate,
                endDate,
                status,
                createdBy
            });
            const saveCampaign = await newCampaign.save();
            res.status(200).json(saveCampaign);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
    getMyCampaigns: async (req, res) => {
        try {
            const campaigns = await Campaign.find({ createdBy: req.user.id })
                .sort({ createdAt: -1 });
            res.status(200).json(campaigns);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = campaignController;