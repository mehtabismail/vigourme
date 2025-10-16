import { View, Image } from 'react-native'
import React from 'react'

const ProfileImg = (props:any) => {
  const {width, height} = props;
  return (
    <View style={{borderRadius:50}}>
      <Image 
      source={require('../assets/images/user.png')} 
      style={{width, height}}
      />
    </View>
  )
}

export default ProfileImg