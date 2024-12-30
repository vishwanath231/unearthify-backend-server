const EventConnect = require("../model/adminStayConnect");

const createEventConnect = async (req, res) => {
    try {
      // Destructure the request body to match the schema
      const { titles, descriptions, heading } = req.body;
  
  
      // Create a new StayConnect document based on the validated data
      const EventConnectNew = new EventConnect({
        titles,
        descriptions,
        heading
      });                                 
  
      // Save the document to the database
      await EventConnectNew.save();
  
      // Return a success message with the created document
      res.status(201).json({ message: "EventConnect created successfully!", data:EventConnect });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
const getEventConnects = async (req, res) => {
  try {
    const EventConnects = await EventConnect.find();
    res.status(200).json({
        data:EventConnects
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getEventConnectById = async (req, res) => {
  try {
    const EventConnect = await EventConnect.findById(req.params.id);
    if (!EventConnect) return res.status(404).json({ message: "EventConnect not found" });
    res.status(200).json(EventConnect);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateEventConnect = async (req, res) => {
  try {
    const updatedEventConnect = await EventConnect.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEventConnect) return res.status(404).json({ message: "EventConnect not found" });
    res.status(200).json({ message: "EventConnect updated successfully!", updatedEventConnect });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteEventConnect = async (req, res) => {
  try {
    const deletedEventConnect = await EventConnect.findByIdAndDelete(req.params.id);
    if (!deletedEventConnect) return res.status(404).json({ message: "EventConnect not found" });
    res.status(200).json({ message: "EventConnect deleted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createEventConnect,
  getEventConnects,
  getEventConnectById,
  updateEventConnect,
  deleteEventConnect,
};
