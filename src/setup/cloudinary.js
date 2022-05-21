const cloudinary = require('cloudinary').v2;
const path = require('path');

exports.setup = () => {
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET,
});
  // const parser = multer({ storage: storage });
}

exports.uploadImage = async (id, folder) => {
  // cloudinary.api.create_upload_preset(
  //   { name: "driver", 
  //     categorization: "driver, f1",
  //     background_removal: "cloudinary_ai",
  //     allowed_formats: 'jpg, png',
  //     folder: "samples" },
  //   function(error, result){console.log(result);});
    try {
    return await cloudinary.uploader.upload(path.join(__dirname, `../assets/images/${id}.png`), {
    public_id: id,
    folder: folder
  });
  } catch (err) {
    console.log(err);
  }
}

exports.getImage = (id) => {
  return cloudinary.url('drivers/sainz.png', {width: 400, height: 400, crop: "fill", fetch_format: "auto"})
  // return cloudinary.image("carlos_sainz.png")
}

exports.createPreset = () => {
}

exports.searchAsset = async (id) => {
  return await cloudinary.search
  .expression('asset_id:' + id)
  .sort_by('public_id','desc')
  .max_results(30)
  .execute()
}

exports.searchPublic = async (id, folder) => {
  try {
    let param = ''
    if(folder) {
      param = `public_id:${folder}/${id}`
    } else {
      param = `public_id:${id}`
    }
  
    console.log(param);
    return await cloudinary.search
    .expression(param)
    .sort_by('public_id','desc')
    .max_results(30)
    .execute()
  } catch (err) {
    console.log(err)
  }
}