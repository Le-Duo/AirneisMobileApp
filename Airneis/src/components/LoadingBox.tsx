import {ActivityIndicator, View, Text} from 'react-native';

export default function LoadingBox() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#005eb8" />
      <Text style={{marginTop: 10}}>Loading...</Text>
    </View>
  );
}
