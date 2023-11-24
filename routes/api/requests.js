const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")
const User = require("../../models/user")
const UserD = require("../../models/userD")
const Expert = require("../../models/experts")
const ExpertD = require("../../models/expertsD")
const Requests = require("../../models/requests")
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const user = require("../../models/user")
require('../../auths/auth')

// final api to use -> /api/requests/

router.get("/", async (req, res) => {
    res.status(201).json({
      message: "Welcome to the Laper Requests API"
    });
  });

  // final api to use -> /api/requests/add

  router.post("/add", auth,  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    try {
  
      
        const request = new Requests();
        request.status = "active",
        request.accepted =  false,
        request.clientId = req.decoded.email,
        request.expertId = "",
        request.problemSolved = false,
        request.requestId = req.decoded.email + Date.now(),
        request.problemStatement = req.body.problemStatement,
        request.requestTime = Date.now(),
        request.requiredTech = req.body.requiredTech,
        request.imgUrl = req.body.imgUrl
  
        console.log('new request created, pushing to database');
  
        const saveRes = await request.save();
        
            if ((!saveRes)) {
                console.log('Some error occured')
              res.status(500).json({
                message: "An error has occured here."
              })
            } else {
                res.status(201).json({
                  message: "Request successfully created."
                });
            }
        }
     catch(e) {
        console.log()
        res.status(500).json({
          message: "Internal Server Error"
        })
    }
  });

  // final api to use -> /api/requests/fetch
  
  router.post("/fetch", async (req, res) => {
    try {
      const field = req.body.field;
      const value = req.body.value;
      const sortField = req.body.sortField;
      const sort = req.body.sort;
      const lim = req.body.lim;
      let result = await Requests.find().sort({[sortField]: sort}).limit(lim)
  
      if(field == "requiredTech"){
  
        result = await Requests.find({
          [field ]:  value
        
        }).sort({[sortField]: sort}).limit(lim)
        
  
  
      }
  
      else if(field == "problemStatement"){
        result = await Requests.find({
          [field] : { $regex: value, $options: "i" }
        
        }).sort({[sortField]: sort}).limit(lim)
  
      }
  
      else{
  
        if(field !== "all" && value !== "all"){
  
         result = await Requests.find(
          {
            [field]: value
          }
  
        ).sort({[sortField]: sort}).limit(lim)
  
      }
    }
  
  
      
  
      if (result == null){
          console.log('Request not found');
          return res.status(401).json(
              {
                  message: 'request not found',
                  found: "false"
              }
  
          )
  
      }
      else{
          console.log('Request found');
          return res.status(200).json({
              message: "Request found",
              found: "true",
              request: result
            });
          }
  
    }
    catch(e) {
      console.log(e);
      res.status(500).json({
        message: "Internal Server Error",
        found: "false"
      })
    }
  
  });

// final api to use -> /api/requests/update
  
router.put("/update", auth, async (req, res) => {
    const field = req.body.field;
    const value = req.body.value;
    try {
      const result = await Requests.findOneAndUpdate({
          requestId: req.body.requestId
  
      },
      {
        $set: {
          [field]: req.body.value
        }
      },
      {
        new: true
      })
  
      // updating avl_experts and avl_users in case status is updated to "accepted"
  
      c_id = result.clientId;
      r_id = req.body.requestId;
      e_id = req.decoded.email;
  
      if(field === 'status'){
        if(value === 'accepted'){
  
          //updating expert's avl_users
  
          try {
            const expUpdate = await ExpertD.findOneAndUpdate({
                email: req.decoded.email
            },
            { $push: { 'avl_users': {c_id : {r_id} } } },
            
            { returnOriginal: false })
          }
          
          //catching error in case updation of avl_users
  
          catch(e) {
            console.log(e);
            res.status(500).json({
              message: "Error occurred when updating available users in experts"
            })
          }
  
          //updating user's avl_experts
  
          try {
            const userUpdate = await UserD.findOneAndUpdate({
                email: c_id
            },
            { $push: { 'avl_experts': {e_id : {r_id} } } },
            
            { returnOriginal: false })
          }
          //catching error in case updation of avl_experts
  
          catch(e) {
            console.log(e);
            res.status(500).json({
              message: "Error occurred when updating available experts in users"
            })
          }
          
        }
      }
  
      //if request is not found
  
      if (result == null){
          console.log('Request not found');
          return res.status(401).json(
              {
                  message: 'Request not found'
              }
  
          )
  
      }
      else{
          console.log('Request found and updated');
          return res.status(200).json({
              message: "Request updated successfully",
            });
          }
  
    }
  
    //catching error in case for the whole updation of request
  
    catch(e) {
      console.log(e);
      res.status(500).json({
        message: "Internal Server Error"
      })
    }
  
  
  })


module.exports = router