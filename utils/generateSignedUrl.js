const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.KEY_ID,
  applicationKey: process.env.APP_KEY,
});

async function generateSignedUrl(fileName) {
  await b2.authorize(); // Asegúrate de manejar posibles errores aquí

  const downloadAuth = await b2.getDownloadAuthorization({
    bucketId: process.env.BUCKET_ID,
    fileNamePrefix: fileName, // El prefijo del archivo para el que quieres la URL
    validDurationInSeconds: 3600, // o el tiempo en segundos que necesites
  });

  const signedUrl = `${fileName}?Authorization=${downloadAuth.config.headers.Authorization}`;
  return signedUrl;
}
module.exports = generateSignedUrl;
