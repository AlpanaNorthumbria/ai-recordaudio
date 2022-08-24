import { StyleSheet, View } from 'react-native';
import UploadScreen from './src/UploadScreen';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <View style={styles.container}>
      <RootSiblingParent> 
        <UploadScreen/>
      </RootSiblingParent> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
