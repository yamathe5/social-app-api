const multer = require("multer");
const dotenv = require("dotenv");
const B2 = require("backblaze-b2");

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadB2 = async (req, res, next) => {

  if (!req.files || req.files.length === 0) {
    return next();
  }

  const b2 = new B2({
    applicationKeyId: process.env.KEY_ID,
    applicationKey: process.env.APP_KEY,
  });

  const authResponse = await b2.authorize();
  const { downloadUrl } = authResponse.data;

  const response = await b2.getUploadUrl({ bucketId: process.env.BUCKET_ID });
  const { authorizationToken, uploadUrl } = response.data;
  const params = {
    uploadUrl,
    uploadAuthToken: authorizationToken,
    fileName: `cod3a/${req.files[0].originalname}`,
    data: req.files[0].buffer,
  };

  const fileInfo = await b2.uploadFile(params);

  const url = `${downloadUrl}/file/${process.env.BUCKET_NAME}/${fileInfo.data.fileName}`;
  res.locals.url = url;

  next();
};

module.exports = { upload, uploadB2 };
