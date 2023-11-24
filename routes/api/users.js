const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require('../../middleware/auth')

const User = require("../../models/user")
const UserD = require("../../models/userD")

// const passport = require('passport');
const { body, validationResult } = require('express-validator');
// require('../../auths/auth')

// final api to use -> /api/users/

router.get("/", async (req, res) => {
    res.status(201).json({
      message: "Welcome to the Laper Users API"
    });
  });

// final api to use -> /api/users/login

  router.post("/login", async (req, res) => {
    try {
        const result = await User.findOne({
            email: req.body.email
        })

        if (result == null){
            console.log('User not found');
            return res.status(401).json(
                {
                    message: 'User not found'
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
                    // expiresIn: '48h'
                }

            );

            return res.status(200).json({
                message: "Auth successful",
                token: token,
                uid: result._id
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

// final api to use -> /api/users/signup


router.post("/signup", body('email').isEmail(),
body('password').isLength({ min: 6 }),
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {

    
      const user = new User();
      user.email =  req.body.email,
      user.password = user.encryptPassword(req.body.password),
      user.isGAuth = false,
      user.date_created = Date.now()
      console.log('new user created, pushing to database');

      const userDet = new UserD();
      userDet.userId =  req.body.email,
      userDet.email =  req.body.email,
      userDet.username = req.body.username,
      userDet.name = req.body.name,
      userDet.userImageUrl = "",
      userDet.req = "",
      userDet.lastActive = Date.now(),
      userDet.desc = "",
      userDet.phoneNumber = "",
      userDet.userType = "user",
      userDet.versionCode = "",
      userDet.versionName = "",
      userDet.date_created = Date.now()
      console.log('new user created, pushing to database');

      const saveRes = await user.save();
      const saveResData = await userDet.save();
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

// final api to use -> /api/users/fetch


router.post("/fetch", auth,  async (req, res) => {
    try {
      const result = await UserD.findOne({
          email: req.decoded.email
      })
  
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


// final api to use -> /api/users/add


router.post("/add",  body('email').isEmail(),
  // body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
        const userDet = new UserD();
        userDet.userId =  req.body.email,
        userDet.email =  req.body.email,
        userDet.username = req.body.username,
        userDet.name = req.body.name,
        userDet.userImageUrl = "",
        userDet.lastActive = Date.now(),
        userDet.req = "",
        userDet.desc = "",
        userDet.phoneNumber = "",
        userDet.userType = "user",
        userDet.versionCode = "",
        userDet.versionName = "",
        userDet.date_created = Date.now()
        console.log('new user created, pushing to database');
        const saveRes = await userDet.save();
            if (!saveRes) {
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


// final api to use -> /api/users/update


router.put("/update", auth, async (req, res) => {
    const field = req.body.field;
    try {
      const result = await UserD.findOneAndUpdate({
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
              message: "User updated successfully",
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

  // final api to use -> /api/users/fetch-experts

router.post("/fetch-experts", auth, async (req, res) => {
    try {
      const field = req.body.field;
      const value = req.body.value;
      const sortField = req.body.sortField;
      const sort = req.body.sort;
      const lim = req.body.lim;
      let result = await ExpertD.find().sort({[sortField]: sort}).limit(lim)
  
      if(field == "skills"){
  
        result = await ExpertD.find({
          [field] : { $all: value }
        
        }).sort({[sortField]: sort}).limit(lim)
  
  
      }
  
      else if(field == "name"){
        result = await ExpertD.find({
          [field] : { $regex: value, $options: "i" }
        
        }).sort({[sortField]: sort}).limit(lim)
  
      }
  
      else{
  
        if(field !== "all" && value !== "all"){
  
         result = await ExpertD.find(
          {
            [field]: value
          }
  
        ).sort({[sortField]: sort}).limit(lim)
  
      }
    }
  
  
      
  
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

module.exports = router

