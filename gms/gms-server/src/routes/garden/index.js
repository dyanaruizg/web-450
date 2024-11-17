const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();
const { Garden } = require('../../models/garden');
const { addGardenSchema, updateGardenSchema } = require('../../schemas');

const ajv = new Ajv();
const validateAddGarden = ajv.compile(addGardenSchema); // Add validation to the addGarden endpoint.
const validateUpdateGarden = ajv.compile(updateGardenSchema); // Add validation to the updateGarden endpoint.

// GET request to return a list of documents from the gardens collection.
router.get('/', async (req, res, next) => { 
  try {
    const gardens = await Garden.find({});
    res.send(gardens); 
  } catch (err) {
    console.error(`Error while getting gardens: ${err}`);
    next(err); 
  }
});

// GET request to return a garden document by Id.
router.get('/:gardenId', async (req, res, next) => { 
  try {
    const garden = await Garden.findOne({ gardenId: req.params.gardenId } );
    res.send(garden); 
  } catch (err) {
    console.error(`Error while getting garden: ${err}`);
    next(err); 
  }
});

// POST request to add a new garden document to the gardens collection.
router.post('/', async (req, res, next) => { 
  try {
    const valid = validateAddGarden(req.body);

    if (!valid) {
      return next(createError(400, ajv.errorsText(validateAddGarden.errors))); 
    }

    const newGarden = new Garden(req.body); 
    await newGarden.save();
    res.send({
      message: 'Garden created successfully',
      gardenId: newGarden.gardenId 
    })
  } catch (err) {
    console.error(`Error while creating garden: ${err}`);
    next(err); 
  }
});

// PATCH request to update a garden document by gardenId in the gardens collection.
router.patch('/:gardenId', async (req, res, next) => { 
  try {
    const garden = await Garden.findOne({ gardenId: req.params.gardenId });
     
    const valid = validateUpdateGarden(req.body);
    
    if (!valid) {
      return next(createError(400, ajv.errorsText(validateUpdateGarden.errors))); 
    }

    garden.set({
      name: req.body.name,
      location: req.body.location, 
      description: req.body.description
    });

    await garden.save();
    
    res.send({
      message: 'Garden updated successfully', 
      gardenId: garden.gardenId
    });
  } catch (err) {
    console.error(`Error while updating garden: ${err}`);
    next(err); 
  }
});

// DELETE request to delete a garden by gardenId in the gardens collection.
router.delete('/:gardenId', async (req, res, next) => { 
  try {
    await Garden.deleteOne({ gardenId: req.params.gardenId }); 
    res.send({
      message: 'Garden deleted successfully',
      gardenId: req.params.gardenId 
    });
  } catch (err) {
    console.error(`Error while deleting garden: ${err}`);
    next(err); 
  }
});

module.exports = router;