const EventConnect = require("../../model/admin/adminStayConnect");
const { v4: uuidv4 } = require("uuid");
const id = uuidv4(); // Generate a unique identifier

// Create EventConnect
const createEventConnect = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const items = req.body.data.map((item) => ({
      itemId: uuidv4(),
      title: item.title,
      description: item.description,
      heading: item.heading,
    }));

    const newEvent = new EventConnect({ items });
    const savedEvent = await newEvent.save();

    console.log("Saved Event:", savedEvent);

    res.status(201).json({
      message: "EventConnect created successfully!",
      data: savedEvent,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};


// Get all EventConnect documents
const getEventConnects = async (req, res) => {
  try {
    const eventConnects = await EventConnect.find();
    res.status(200).json({ data: eventConnects });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get EventConnect by ID (Entire Document)
const getEventConnectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params,"connect id 1 ")
    const event = await EventConnect.findById(id);

    if (!event) {
      return res.status(404).json({ message: "EventConnect not found" });
    }

    res.status(200).json({
      message: "EventConnect fetched successfully!",
      data: event,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get Specific Item by Item ID
const getEventItemById = async (req, res) => {
  try {
    const { id, itemId } = req.params; 
    console.log (req.params,"connect data 2 id")
    const event = await EventConnect.findById(id);

    if (!event) {
      return res.status(404).json({ message: "EventConnect not found" });
    }

    const item = event.items.find((item) => item.itemId === itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item fetched successfully!",
      data: item,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update Specific Item by Item ID
const updateEventItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    console.log(req.params,"connect update 3 ")
    const { title, description, heading } = req.body;

    const updatedEvent = await EventConnect.findOneAndUpdate(
      { _id: id, "items.itemId": itemId },
      {
        $set: {
          "items.$.title": title,
          "items.$.description": description,
          "items.$.heading": heading,
        },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully!",
      data: updatedEvent,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete Specific Item by Item ID
const deleteEventItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const updatedEvent = await EventConnect.findByIdAndUpdate(
      id,
      { $pull: { items: { itemId } } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item deleted successfully!",
      data: updatedEvent,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Update EventConnect document
const updateEventConnect = async (req, res) => {
  try {
    const { id } = req.params;
 console.log(req.params," 4")
    const updatedEventConnect = await EventConnect.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedEventConnect) {
      return res.status(404).json({ message: "EventConnect not found" });
    }

    res.status(200).json({
      message: "EventConnect updated successfully!",
      data: updatedEventConnect,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// Delete EventConnect document
const deleteEventConnect = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEventConnect = await EventConnect.findByIdAndDelete(id);

    if (!deletedEventConnect) {
      return res.status(404).json({ message: "EventConnect not found" });
    }

    res.status(200).json({
      message: "EventConnect deleted successfully!",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createEventConnect,
  getEventConnects,
  getEventConnectById,
  getEventItemById,
  updateEventItem,
  deleteEventItem,
  updateEventConnect,
  deleteEventConnect,
};
