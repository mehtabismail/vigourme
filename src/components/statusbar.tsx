import React from 'react';
import { StatusBar } from 'react-native';
import Colors from '../common/colors';

const StatusBarComponent = (props: any) => {
  return (
    <StatusBar
      barStyle={'dark-content'}
      backgroundColor={props.colorWhite ? Colors.WHITE : Colors.THEMECOLOR}
    />
  );
};

export default StatusBarComponent;
