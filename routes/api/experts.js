const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")

const Expert = require("../../models/experts")
const ExpertD = require("../../models/expertsD")
const Requests = require("../../models/requests")
// const passport = require('passport');
const { body, validationResult } = require('express-validator');
const user = require("../../models/user")
require('../../auths/auth')

// final api to use -> /api/experts/

router.get("/", async (req, res) => {
    res.status(201).json({
      message: "Welcome to the Laper Experts API"
    });
  });

// final api to use -> /api/experts/add

  router.post("/add",  body('email').isEmail(),
  // body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const expertDet = new ExpertD();
        expertDet.expertId =  req.body.email,
        expertDet.email =  req.body.email,
        expertDet.username = req.body.username,
        expertDet.name = req.body.name,
        expertDet.userImageUrl = "",
        expertDet.lastActive = Date.now(),
        expertDet.req = "",
        expertDet.desc = "",
        expertDet.phoneNumber = "",
        expertDet.userType = "user",
        expertDet.versionCode = "",
        expertDet.versionName = "",
        expertDet.date_created = Date.now()
        console.log('new expert created, pushing to database');
        const saveRes = await expertDet.save();
            if (!saveRes) {
                console.log('Some error occured')
              res.status(500).json({
                message: "An error has occured here."
              })
            } else {
                res.status(201).json({
                  message: "Expert successfully created."
                });
            }
        }
     catch(e) {
        console.log()
        res.status(500).json({
          message: "An error has occured initially."
        })
    }
});

// final api to use -> /api/experts/fetch

router.post("/fetch", auth,  async (req, res) => {
  try {
    const result = await ExpertD.findOne({
        email: req.decoded.email
    })

    if (result == null){
        console.log('Expert not found');
        return res.status(401).json(
            {
                message: 'Expert not found'
            }

        )

    }
    else{
        console.log('Expert found');
        return res.status(200).json({
            message: "Expert found",
            expert: result
          });
        }

  }
  catch(e) {
    console.log(e);
    res.status(500).json({
      message: "An error has occured."
    })
  }

});

// final api to use -> /api/experts/update

router.put("/update", auth, async (req, res) => {
  const field = req.body.field;
  try {
    const result = await ExpertD.findOneAndUpdate({
        email: req.decoded.email
    },
    {
      $set: {
        [field]: req.body.value
      }
    },
    {
      new: true
    })

    if (result == null){
        console.log('Expert not found');
        return res.status(401).json(
            {
                message: 'Expert not found'
            }

        )

    }
    else{
        console.log('Expert found');
        return res.status(200).json({
            message: "Expert updated successfully",
            user: result
          });
        }

  }
  catch(e) {
    console.log(e);
    res.status(500).json({
      message: "An error has occured."
    })
  }


})

// final api to use -> /api/experts/login

router.post("/login", async (req, res) => {
  try {
      const result = await Expert.findOne({
          email: req.body.email
      })

      if (result == null){
          console.log('Expert not found');
          return res.status(401).json(
              {
                  message: 'Expert not found'
              }

          )
      }
      else if(!result.validPassword(req.body.password)){
          req.flash('error', 'Incorrect Credentials')
          res.status(401).json(
              {
                  message: 'Incorrect Credentials'
              }
          )
      }
      else{
          console.log('Logged In');
          const token = jwt.sign(
              {
                  email: result.email

              },
              process.env.AUTH_SECRET,
              {
                  expiresIn: '48h'
              }

          );

          return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
      }
  catch(err){
    console.log(err);
    res.status(500).json({
      error: err
    });
  }

});

// final api to use -> /api/experts/signup

router.post("/signup", body('email').isEmail(),
body('password').isLength({ min: 6 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {

    
      const expert = new Expert();
      expert.email =  req.body.email,
      expert.password = expert.encryptPassword(req.body.password),
      expert.isGAuth = false,
      expert.date_created = Date.now()
      console.log('new expert created, pushing to database');

      const expertDet = new ExpertD();
      expertDet.expertId =  req.body.email,
      expertDet.email =  req.body.email,
      expertDet.username = req.body.username,
      expertDet.name = req.body.name,
      expertDet.userImageUrl = "",
      expertDet.skills = new Array(),
      expertDet.req = "",
      expertDet.verified = false,
      expertDet.country = "",
      expertDet.req = "",
      expertDet.lastActive = Date.now(),
      expertDet.desc = "",
      expertDet.phoneNumber = "",
      expertDet.userType = "expert",
      expertDet.versionCode = "",
      expertDet.versionName = "",
      expertDet.date_created = Date.now()
      console.log('new user created, pushing to database');

      const saveRes = await expert.save();
      const saveResData = await expertDet.save();
          if ((!saveRes) || (!saveResData)) {
              console.log('Some error occured')
            res.status(500).json({
              message: "An error has occured here."
            })
          } else {
              res.status(201).json({
                message: "User successfully created."
              });
          }
      }
   catch(e) {
      console.log()
      res.status(500).json({
        message: "An error has occured initially."
      })
  }
});

// final api to use -> /api/experts/fetch-users

router.post("/fetch-users", auth, async (req, res) => {
    try {
      const field = req.body.field;
      const value = req.body.value;
      const sortField = req.body.sortField;
      const sort = req.body.sort;
      const lim = req.body.lim;
      let result = await UserD.find().sort({[sortField]: sort}).limit(lim)
  
      if(field == "name"){
        result = await UserD.find({
          [field] : { $regex: value, $options: "i" }
        
        }).sort({[sortField]: sort}).limit(lim)
  
      }
  
      else{
  
        if(field !== "all" && value !== "all"){
  
         result = await UserD.find(
          {
            [field]: value
          }
  
        ).sort({[sortField]: sort}).limit(lim)
  
      }
    }
  
  
      
  
      if (result == null){
          console.log('User not found');
          return res.status(401).json(
              {
                  message: 'User not found'
              }
  
          )
  
      }
      else{
          console.log('User found');
          return res.status(200).json({
              message: "User found",
              user: result
            });
          }
  
    }
    catch(e) {
      console.log(e);
      res.status(500).json({
        message: "An error has occured."
      })
    }
  
  });




module.exports = router