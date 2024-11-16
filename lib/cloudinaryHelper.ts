
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const uploadMusicFileOnCloudinary = async (filePath:string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "music"
    });
    return { public_id: result.public_id, secure_url: result.secure_url }
  }
  catch (error) {
    console.log(error)
    return({
      success: false,
      message: error});
  }
}