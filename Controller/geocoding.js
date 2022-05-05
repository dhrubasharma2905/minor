const Geos = require('../Models/geolocation')
const axios = require('axios');
exports.getlocation = async(req,res)=>
{
  const params = {
  auth: '388475087947669536643x61803',
  locate:req.body.state,
  json: '1'
}
axios.get('https://geocode.xyz', {params})
  .then(response => {
    let geos = new Geos ({
      latitude:response.data.latt,
      longitude:response.data.longt
    })
    if(! geos) { return res.status(400).json({error:"not found"})}
    else geos.save();
    console.log(response.data.longt);
    console.log(response.data.latt)
  }).catch(error => {
    console.log(error);
  });
}