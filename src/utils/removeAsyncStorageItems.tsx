import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function RemoveItemFromAsyncStorage(key: string) {
  await AsyncStorage.removeItem(key);
}
