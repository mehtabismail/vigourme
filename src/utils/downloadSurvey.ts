import RNFetchBlob from 'react-native-blob-util';

const DownloadSurveyInPDF = (
  patientId: any,
  fileLink: string,
  Toast: any,
  Platform: any
) => {
  try {
    // iOS side needs to integrated and tested...
    const { config, fs } = RNFetchBlob;
    const aPath = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.PictureDir,
    });
    const fPath = `${aPath}/${patientId}_questionnaire_report.pdf`;
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
          title: `${patientId}_questionnaire_report.pdf`,
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
        Toast.show("Report Downloaded Successfully.");
      });
  } catch (e: any) {
    console.log("Download Error: ", e.message);
  }
};

export default DownloadSurveyInPDF;
