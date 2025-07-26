import Return from '../models/Return.js';  // Adjust path if needed

// GET /returns - Fetch all returns
export const getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find().sort({ createdAt: -1 }); // optional: .populate('customer')
    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returns:", error);
    res.status(500).json({ message: 'Server error while fetching return data.' });
  }
};

// (Optional) PUT /returns/:id - Update status or reason
export const updateReturn = async (req, res) => {
  try {
    const updated = await Return.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Return not found' });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating return:", error);
    res.status(500).json({ message: 'Update failed' });
  }
};
