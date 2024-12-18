const formFamilyMem = require("../model/familymember");

// POST endpoint to create a new family member (with image)

const familyFormMemPost = async (req, res) => {
  try {
    const { familyId, name, dob, gender, maritalStatus, education, employmentStatus, contactEmail, contactPhone, occupation } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;  
    console.log(req.file,"file")
    const memberFamily = new formFamilyMem({
      familyId,
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
      image,
    });

    await memberFamily.save();

    res.json({
      data: memberFamily,
    });
    console.log("Saved Family Member:", memberFamily);
  } catch (error) {
    console.error("Error saving family member:", error); // Log the full error
    res.status(500).json({
      Error: error.message,
    });
  }
};


// GET endpoint to fetch all family members
const familyMemGet = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id family", id);
    const familyMem = await formFamilyMem.find({familyId:id});
    res.json({
      data: familyMem,
    });
  } catch (error) {
    res.json({
      Error: error.message,
    });
  }
};

const familyMemGetAll = async (req, res) => {
  try {
    
    const familyMem = await formFamilyMem.find();
    res.json({
      data: familyMem,
    });
  } catch (error) {
    res.json({
      Error: error.message,
    });
  }
};
// GET: Fetch a family member by ID

const getFamilyMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await formFamilyMem.findById(id);
    if (!member)
      return res.status(404).json({ message: "Family member not found" });

    res.json({ data: member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT endpoint to update a family member by ID
const familyMemUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      familyId,
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
    } = req.body;
    

    // If no new image is uploaded, keep the old image path
    const updateData = {
      familyId,
      name,
      dob,
      gender,
      maritalStatus,
      education,
      employmentStatus,
      contactEmail,
      contactPhone,
      occupation,
    };
  

    const updatedMember = await formFamilyMem.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      data: updatedMember,
    });
  } catch (error) {
    res.status(500).json({
      Error: error.message,
    });
  }
};

// DELETE endpoint to delete a family member by ID
const familyMemDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await formFamilyMem.findByIdAndDelete(id);
    res.json({
      message: "Family member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      Error: error.message,
    });
  }
};

module.exports = {
  familyFormMemPost,
  familyMemGet,
  familyMemUpdate,
  familyMemDelete,
  getFamilyMemberById,
  familyMemGetAll
};
