import React from "react";
import { useSelector, useDispatch } from "react-redux";

const useGetReduxState = () => {
  const state = useSelector((state) => state);
  return state;
};

export default useGetReduxState;
