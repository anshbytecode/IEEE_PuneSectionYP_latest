const prisma = require('../config/prisma');
const { uploadBufferToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('../services/cloudinaryService');

const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { name: 'asc' }
      ]
    });
    return res.status(200).json({
      success: true,
      teamMembers
    });
  } catch (error) {
    console.error('Get team members error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve team members.' });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const { name, position, affiliation, contact, linkedin_url, order_index } = req.body;

    if (!name || !position) {
      return res.status(400).json({ success: false, message: 'Name and position are required.' });
    }

    let profileImageUrl = '/drive-download/member1.jpg';
    const files = req.files || {};

    if (files.profileImage && files.profileImage[0]) {
      const uploadResult = await uploadBufferToCloudinary(files.profileImage[0].buffer, 'team', 'image');
      profileImageUrl = uploadResult.secure_url;
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        affiliation: affiliation || null,
        contact: contact || null,
        profileImageUrl,
        linkedinUrl: linkedin_url || null,
        orderIndex: parseInt(order_index || 0, 10)
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Team member added successfully.',
      teamMember
    });
  } catch (error) {
    console.error('Create team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add team member.' });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if team member exists
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    });
    if (!existingMember) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    const { name, position, affiliation, contact, linkedin_url, order_index } = req.body;
    const files = req.files || {};

    let profileImageUrl = existingMember.profileImageUrl;
    if (files.profileImage && files.profileImage[0]) {
      // Delete old photo
      const oldPhotoPublicId = getPublicIdFromUrl(existingMember.profileImageUrl);
      if (oldPhotoPublicId) {
        await deleteFromCloudinary(oldPhotoPublicId, 'image');
      }
      // Upload new photo
      const uploadResult = await uploadBufferToCloudinary(files.profileImage[0].buffer, 'team', 'image');
      profileImageUrl = uploadResult.secure_url;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: name || existingMember.name,
        position: position || existingMember.position,
        affiliation: affiliation !== undefined ? affiliation : existingMember.affiliation,
        contact: contact !== undefined ? contact : existingMember.contact,
        profileImageUrl,
        linkedinUrl: linkedin_url !== undefined ? linkedin_url : existingMember.linkedinUrl,
        orderIndex: order_index !== undefined ? parseInt(order_index, 10) : existingMember.orderIndex
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Team member details updated successfully.',
      teamMember: updatedMember
    });
  } catch (error) {
    console.error('Update team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update team member details.' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if team member exists
    const member = await prisma.teamMember.findUnique({
      where: { id }
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    // Remove photo from Cloudinary
    const photoPublicId = getPublicIdFromUrl(member.profileImageUrl);
    if (photoPublicId) {
      await deleteFromCloudinary(photoPublicId, 'image');
    }

    // Delete from Database
    await prisma.teamMember.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Team member deleted successfully.'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete team member.' });
  }
};

const reorderTeam = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order_index }

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Orders list array is required.' });
    }

    // Execute bulk re-order queries in a single transaction
    const transactions = orders.map(item => 
      prisma.teamMember.update({
        where: { id: item.id },
        data: { orderIndex: parseInt(item.order_index || item.orderIndex, 10) }
      })
    );
    await prisma.$transaction(transactions);

    return res.status(200).json({
      success: true,
      message: 'Team order updated successfully.'
    });
  } catch (error) {
    console.error('Reorder team members error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder team members.' });
  }
};

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeam
};
