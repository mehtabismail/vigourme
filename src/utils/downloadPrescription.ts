const downloadLatestPrescriptionPDF = async (
  fileLink: string,
  pdfFileName: string,
  Platform: any,
  RNFetchBlob: any,
  Toast: any
) => {
  // iOS side needs to integrated and tested...
  const { config, fs } = RNFetchBlob;
  // let PictureDir = fs.dirs.PictureDir;

  const aPath = Platform.select({
    ios: fs.dirs.DocumentDir,
    android: fs.dirs.PictureDir,
  });
  const fPath = `${aPath}/${pdfFileName}`;
  const configOptions: any = Platform.select({
    ios: {
      fileCache: true,
      path: fPath,
      appendExt: "pdf",
    },
    android: {
      fileCache: false,
      appendExt: "pdf",
      addAndroidDownloads: {
        useDownloadManager: true,
        title: pdfFileName,
        description: "Downloading...",
        mime: "application/pdf",
        mediaScannable: true,
        notification: true,
        path: fPath,
        // description: "Questionnaire Report",
      },
    },
  });
  config(configOptions)
    .fetch("GET", fileLink)
    .then((res) => {
      if (Platform.OS == "ios") {
        RNFetchBlob.ios.previewDocument(res.data);
      }
      //Showing alert after successful downloading
      Toast.show("Prescription Downloaded Successfully.");
    });
};

export default downloadLatestPrescriptionPDF;
