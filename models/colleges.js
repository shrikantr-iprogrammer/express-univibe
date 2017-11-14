const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const CollegesSchema = mongoose.Schema({

  name: { type: String, required: true },
  slug: { type: String, required: true },
  domain: { type: String },
  registered_date: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
  long_name: { type: String, required: true },
  short_name: { type: String, required: true },
  
  favicon: { type: String, default: '/assets/build/images/favicon.ico' },
  logo_s: { type: String, default: '/assets/build/images/logo_s.jpg' },
  logo_l: { type: String, default: '/assets/build/images/logo_l.jpg' },
  footer_text: { type: String, default: 'Powered by Univibe.' },
  theme_color: { 
    button_color: { type: String, default: '#ce0f18' },
    navigation_color: { type: String, default: '#ce0f18' },
    link_color: { type: String, default: '#ce0f18' },
    tab_color: { type: String, default: '#ce0f18' },
    progress_bar_color: { type: String, default: '#ce0f18' }
  },

  establishment_year: { type: Number, default: 1950 },
  theme_id: { type: Number, default: 1 },
  import_csv_default_email: { type: String },
  instamojo: {
    international_insta_mojo_token: { type: String, default: '' },
    international_insta_mojo_key: { type: String, default: '' },
    international_insta_mojo_salt: { type: String, default: '' },
    domestic_insta_mojo_token: { type: String, default: '' },
    domestic_insta_mojo_key: { type: String, default: '' },
    domestic_insta_mojo_salt: { type: String, default: '' }  
  },

  facebook_client_id: { type: String, default: '' },
  facebook_secret_key: { type: String, default: '' },
  linkedin_client_id: { type: String, default: '' },
  linkedin_secret_key: { type: String, default: '' },
  contact_email: { type: String, default: '' },
  twitter_url: { type: String, default: '' },
  twitter_data_widget_id: { type: String, default: '' },
  facebook_href: { type: String, default: '' },
  google_analytics: { type: String, default: '' },
  firebase_server_key: { type: String, default: '' },
  
  banner: [{
    image: { type: String, default: '/assets/build/images/banner.jpg' },
    text: { type: String, default: 'Univibe Network' },
    active: { type: Boolean, default: true }
  }],
  status: { type: Number, default: 0 }    //0=unpublished, 1=published, 2=suspended

});

CollegesSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.last_updated = ret.last_updated;
    ret.registered_date = ret.registered_date;
    // delete ret._id;
    // delete ret.__v;
  }
};
const colleges = module.exports = mongoose.model('Colleges', CollegesSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.createNewCollege = function(collegeData){
  var data = new colleges(collegeData);
  return data.save()
    .then(item => ({ msg: "item saved to database", slug: collegeData.slug }))
    .catch(err => ({ msg: "unable to save to database" }));
}

module.exports.checkCollegeNameExists = (name, slug)=>{
  console.log('model -',name);
  console.log('model -',slug);
  return Promise.all([
    colleges.count({"name": name}).then(count => ({ name: count })),
    colleges.count({"slug": slug}).then(count => ({ slug: count }))
  ]).then(result => result.reduce((acc,curr) =>
    Object.assign(acc,curr),{})
  );
}

module.exports.getCollegeData = (slug)=>{
    // console.log('model -',slug);
    return Promise.all([
      colleges.findOne({"slug": slug}).then(data => ({ data: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );
}

module.exports.getCollegeList = (pageSize, skip, sortby, orderby, query)=>{
  
    console.log("limit- "+pageSize);
    console.log("skip- "+skip);
    console.log("sort- "+sortby);
    console.log("order- "+orderby);
    console.log("query- "+JSON.stringify(query));

    return Promise.all([
      colleges.count().then(count => ({ total: count })),
      colleges.count(query).then(count => ({ searched_total: count })),
      colleges.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}

// module.exports.deleteUserById = (req)=>{
//   id = req.query.userID;
//   User.findByIdAndRemove(id, function (err, res){
//     if(err) { throw err; }
//     if( res.result.n === 0 ) { console.log("Record not found"); }
//     console.log("Deleted successfully.");
//   });
// }

// module.exports.addUser = function(newUser, callback){
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(newUser.password, salt, (err, hash) => {
//       if(err) throw err;
//       newUser.password = hash;
//       newUser.save(callback);
//     });
//   });
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
//   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//     if(err) throw err;
//     callback(null, isMatch);
//   });
// }
