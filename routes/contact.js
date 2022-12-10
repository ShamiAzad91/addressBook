const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/token");
const Contact = require("../models/contact");


const multer = require("multer");
const path = require("path");
const csv = require("csvtojson");


const {createContact,singleContact,updateContact,deleteContact,getAllContact} = require("../controllers/contact");

router.post("/new/contact",verifyToken,createContact);
router.get("/contact/single/:id",verifyToken,singleContact);
router.put("/contact/single/update/:id",verifyToken,updateContact);
router.delete("/contact/single/remove/:id",verifyToken,deleteContact);
router.get("/contact/all",verifyToken,getAllContact);

//multer start here for bulk upload of contact
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./upload");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  const upload = multer({ storage: fileStorageEngine });

  router.post("/contact/upload", verifyToken,upload.single("file"), (req, res, next) => {
    csv()
      .fromFile(req.file.path)
      .then((jsonObj) => {
        var army = [];
        for (var i = 0; i < jsonObj.length; i++) {
          var obj = {};
          obj.user_name = jsonObj[i]["user_name"];
          obj.phone = jsonObj[i]["phone"];
          obj.state = jsonObj[i]["state"];
          obj.city = jsonObj[i]["city"];
          obj.pincode = jsonObj[i]["pincode"];

          army.push(obj);
        }
        Contact
          .insertMany(army)
          .then(function () {
            res.status(200).send({
              message: "Successfully Uploaded!",
            });
          })
          .catch(function (error) {
            res.status(500).send({
              message: "failure",
              error,
            });
          });
      })
      .catch((error) => {
        res.status(500).send({
          message: "failure",
          error,
        });
      });
  });

module.exports = router;