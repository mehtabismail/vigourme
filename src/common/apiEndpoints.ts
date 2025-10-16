const EndPoint = {
  SIGN_IN: "/api/user/signIn",
  PATIENT_SIGN_UP: "/api/user/signUp",
  FORGOT_PASSWORD: "/api/user/forgotPassword",
  UPDATE_PASSWORD: "/api/user/updatePassword",
  SURVEY_QUESTIONS: "/api/patient/public/getSurvey",
  SUBMIT_SURVEY: "/api/patient/submitSurvey",
  DOWNLOAD_PATIENT_SURVEY: "/api/doctor/downloadSubmittedSurvey",
  SUBMIT_PRESCRIPTION: "/api/doctor/submitPrescription",
  DOWNLOAD_PRESCRIPTION: "/api/patient/downloadPrescription",
  APPROVE_SURVEY: "/api/doctor/approve-survey",
  CANCEL_SURVEY: "/api/doctor/cancel-survey",
  LATEST_PRESCRIPTION: "/api/patient/getLatestPrescription",
  ORDER_MEDICINE: "/api/patient/order/medicines",
  SOCIAL_LOGIN: "/api/patient/socialMedia/signIn",
  SOCIAL_SIGNUP: "/api/patient/signUp",
  FIREBASE_PRIVATE_TOKEN: "/api/user/firebase",
};

export default EndPoint;
