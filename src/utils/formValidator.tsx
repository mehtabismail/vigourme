import isEmpty from "./isEmpty";

// All the any data types needs to be removed

const validateEmptyFields = (formData: any, errorMessages: any) => {
  let errors: any = {};
  for (const data in formData) {
    if (isEmpty(formData[data]) && data in errorMessages) {
      errors[data] = `${errorMessages[data]} is Required`;
    }
    if (data == "email" && !isEmpty(formData[data])) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      let isEmail = reg.test(formData[data]);
      if (isEmail == false) {
        errors[data] = "Email must be valid";
      }
    }
    if (data == "password" && !isEmpty(formData[data])) {
      let reg =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      let isPasswordValid = reg.test(formData[data]);
      if (isPasswordValid == false) {
        errors[data] =
          "Password must be 8 characters long, one special character, a number and a capital letter";
      }
    }
  }
  return errors;
};
const equalFields = (fieldOne: any, fieldTwo: any, fieldName: any) => {
  if (
    typeof fieldOne == "string" &&
    typeof fieldTwo == "string" &&
    !isEmpty(fieldOne) &&
    !isEmpty(fieldTwo)
  ) {
    if (fieldOne !== fieldTwo) {
      return `${fieldName ? fieldName : "Fields"} must be equal`;
    }
  }
};
export { validateEmptyFields, equalFields };
