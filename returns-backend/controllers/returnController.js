const Return = require("../models/returnModel");

// GET all returns
exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find();
    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// UPDATE return status
exports.updateReturnStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedReturn = await Return.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReturn) {
      return res.status(404).json({ message: "Return not found" });
    }

    res.status(200).json(updatedReturn);
  } catch (error) {
    console.error("Error updating return status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};
