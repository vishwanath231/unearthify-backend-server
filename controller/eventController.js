const Event = require("../model/Event");

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

// Create new event
const createEvent = async (req, res) => {
  try {
    const { title, date, location, description ,categories} = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Event image is required" });
    }

    const image = `/api/eventImage/${req.file.filename}`;

    const newEvent = new Event({
      title,
      date,
      location,
      description,
      image,
      categories
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating event", error: error.message });
  }
};

// Update event by ID
const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, location, description,categories } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (title) event.title = title;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;
    if (categories) event.categories = categories;

    if (req.file) {
      event.image = `/api/eventImage/${req.file.filename}`;
    }

    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating event", error: error.message });
  }
};

// Delete event by ID
const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
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
