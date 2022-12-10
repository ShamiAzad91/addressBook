const Contact = require("../models/contact");
const User = require("../models/user");

//new contact
exports.createContact = async(req,res)=>{
    try{
        let name = await User.findOne({_id:req.userId});
        let user_name = name.name;

        let contact = new Contact({
            user_name:user_name,
            phone:req.body.phone,
            state:req.body.state,
            city:req.body.city,
            pincode:req.body.pincode,
            userId:req.userId
        });
        let result = await contact.save();
        if(!result)
        return res.status(400).json({err:"",message:"unable to save contact in Db",status:"failed"})
        return res.status(200).json({err:"",contact:result,message:"succcesfully  save contact in Db",status:"Succes"})
    }catch(err){
        return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})
    }
}

//single contact
exports.singleContact = async(req,res)=>{
    try{
        let contact = await Contact.find({_id:req.params.id});
        if(!contact)
        return res.status(400).json({err:"",message:"unnable to get a contact",status:"failed"})
        return res.status(200).json({err:"",contact:contact,message:"Details of the contact",status:"Success"})

    }catch(err){
        return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})
    }
}
//update contact
exports.updateContact = async(req,res)=>{
    try{
        let contact = await Contact.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{new:true});
        if(!contact)
        return res.status(400).json({err:"",message:"unnable to update  a contact",status:"failed"})
        return res.status(200).json({err:"",updatedContact:contact,message:"Successfully updated",status:"Success"})
    }catch(err){
        return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})
    }
}
//deltecontact
exports.deleteContact= async(req,res)=>{
    try{
     let id = req.params.id;
    let result =  await Contact.findByIdAndRemove(id);
    if(!result)
    return res.status(400).json({error:"Unable to delete the contact",status:"failed"});
    return res.status(202).json({message:"successfully deleted the contact",status:"success"})

    }catch(err){
    return res.status(500).json({err:err.message,message:"Something went wrong",status:"failed"})
    }
}

//get contact and pagination and matching
exports.getAllContact = async (req, res) => {
    try {
      let query = {};

      if (req.body.user_name) {
        query.user_name = req.body.user_name;
      }
  
      if (req.body.phone) {
        query.phone = req.body.phone;
      }
  
      if (req.body.state) {
        query.state = req.body.state;
      }
  
      if (req.body.city) {
        query.city = req.body.city;
      }
  
      if (req.body.pincode) {
        query.pincode = req.body.pincode ;
      }
  
      let search = req.query.search;
      if (search && search !== '') {
      query.$or = [{ user_name: { $regex: search, $options: 'i' } }, { state: { $regex: search, $options: 'i' } }, { city: { $regex: search, $options: 'i' } }];
      }

      let contactcount = await Contact.countDocuments(query);
      let page = req.query.page || req.query.page == '' ? parseInt(req.query.page) : 1;
      let count = contactcount;
      if (count <= 0) count += 1;
      let limit = req.query.limit && req.query.limit != 'all' ? parseInt(req.query.limit) : count;
      let skip = limit * (page - 1);
      if (skip > count) {
        page = 1;
        skip = 0;
      }
      let numberOfPage = Math.ceil(count / limit);
  
      let contacts = await Contact.find(query, { user_name: 1, phone: 1, state: 1, city: 1, pincode: 1 }).skip(skip).limit(limit);
      let paginate = {};
      paginate.listofcontacts = contacts;
      paginate.totalcontacts = contactcount;
      paginate.numberOfPage = numberOfPage;
      paginate.currentPage = page;
      paginate.previousPage = page - 1 === 0 ? page : page - 1;
      paginate.nextPage = page + 1 > numberOfPage ? page : page + 1;
  
      return res.status(200).json({ err: '', result: paginate, status: 'success' });
    } catch (error) {
      return res.status(500).json({ err: error.message, msg: 'Somthing went wrong!', status: 'failed' });
    }
  };


