const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/user")
const UserD = require("../models/userD")
const Expert = require("../models/experts")
const ExpertD = require("../models/expertsD")
const Requests = require("../models/requests")
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const user = require("../models/user")
require('../auths/auth')


router.get("/", async (req, res) => {
    res.status(201).json({
      message: "Welcome to the laper API"
    });
  });


  
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





router.post("/user-fetch", auth,  async (req, res) => {
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

router.post("/user-add",  body('email').isEmail(),
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

router.put("/user-update", auth, async (req, res) => {
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

// experts routes

router.post("/expert-add",  body('email').isEmail(),
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

router.post("/expert-fetch", auth,  async (req, res) => {
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

router.put("/expert-update", auth, async (req, res) => {
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

router.post("/expert-login", async (req, res) => {
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


router.post("/expert-signup", body('email').isEmail(),
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

router.post("/user-fetch-experts", auth, async (req, res) => {
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

router.post("/add-request", auth,  async (req, res) => {
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

router.post("/fetch-requests", async (req, res) => {
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

router.put("/update-request", auth, async (req, res) => {
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
          {
            $set: {
              'avl_users': {c_id : {r_id} }
            }
          },
          {
            new: true
          })
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
          {
            $set: {
              'avl_experts': {e_id : {r_id} }
            }
          },
          {
            new: true
          })
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

router.post("/expert-fetch-users", auth, async (req, res) => {
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