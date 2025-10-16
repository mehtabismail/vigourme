import firestore from "@react-native-firebase/firestore";

export const seedingQuestionaire = (docName: any, data: any) => {
  var arr: any = [];
  data.map((item: any) => {
    var temp = null;
    if (item?.skip) {
      temp = {
        ...item,
        id: item?.id - 1,
        skip: { ...item.skip, next: item?.skip?.next - 1 },
      };
    } else {
      temp = {
        ...item,
        id: item?.id - 1,
      };
    }
    arr.push(temp);
  });

  if (arr.length > 0) {
    var questions = arr;
    firestore()
      .collection("survey-questions")
      .doc(docName)
      .set({ questions })
      .then(() => console.log(docName + " successfully seed!"));
  }
};

export const addIDS = (data: any) => {
  var arr: any = [];
  let id = 1;
  data.map((item: any) => {
    var temp = null;
    temp = {
      ...item,
      id: id,
    };
    id++;
    arr.push(temp);

    console.log(arr, "checking array ");
  });
};
