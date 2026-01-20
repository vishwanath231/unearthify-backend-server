const Event = require("../model/Event");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../middleware/cloudinaryUpload");

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, categories } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: "title, date, location are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Event image is required" });
    }

    const imgRes = await uploadToCloudinary(req.file.buffer, "events");

    const newEvent = new Event({
      title,
      date,
      location,
      description,
      categories,
      image: imgRes.secure_url,
      imageId: imgRes.public_id
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent
    });

  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ success: false, message: "Error creating event", error: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events", error: error.message });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "upcoming" }).sort({ date: 1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching upcoming events", error: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching event", error: error.message });
  }
};

// Update event by ID
const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const { title, date, location, description, categories } = req.body;

    if (typeof title === "string") event.title = title;
    if (typeof date === "string") event.date = date;
    if (typeof location === "string") event.location = location;
    if (typeof description === "string") event.description = description;
    if (categories !== undefined) event.categories = categories;

    if (req.file) {
      // delete old image
      if (event.imageId) {
        await cloudinary.uploader.destroy(event.imageId);
      }

      // upload new image
      const imgRes = await uploadToCloudinary(req.file.buffer, "events");
      event.image = imgRes.secure_url;
      event.imageId = imgRes.public_id;
    }

    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event
    });

  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({ success: false, message: "Error updating event", error: error.message });
  }
};

// Delete event by ID
const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.imageId) {
      await cloudinary.uploader.destroy(event.imageId);
    }
    
    await event.deleteOne();
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ success: false, message: "Error deleting event", error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
};
