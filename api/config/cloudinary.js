import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: 'dwyfa4xdr',
        api_key: '195198313873666',
        api_secret: 'o94IcD_DiOBbxpz-_raTGC4oC4A'
    });

    console.log("✅ Cloudinary connected successfully!");
};

export default connectCloudinary;
