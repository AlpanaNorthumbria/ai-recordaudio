import React,{useState} from 'react';
import { StyleSheet, Text, View,Image,TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Input } from 'react-native-elements';
// import { Input } from '@rneui/themed';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

const SignInScreen = ({ navigation}) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [validationMessage,setvalidationMessage] = useState('');
  
  async function login() {
    if (email === '' || password === '') {
      setvalidationMessage('required filled missing')
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
     setvalidationMessage(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../assets/icon.png')} style={{width:150,height:150,alignSelf:'center'}}/>
        <Input
          placeholder='Email'
          disabled={false}
          containerStyle={{ paddingHorizontal: 0, width: 320 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          leftIcon={<Icon name='envelope' size={16} color='black'/>}
          leftIconContainerStyle={{width: 50}}
          renderErrorMessage={true}
        />

        <Input
          placeholder='Password'
          disabled={false}
          containerStyle={{ paddingHorizontal: 0, width: 320 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          leftIcon={<Icon name='key' size={16} color='black'/>}
          leftIconContainerStyle={{width: 50}}
          renderErrorMessage={true}
        />
       {<Text style={styles.error}>{validationMessage}</Text>}

        <Button title="Sign in" buttonStyle={{marginTop:10}} onPress={login} />
        <Text style={{marginTop:5,fontSize:17}}> Don't have an account yet ? 
            <TouchableOpacity onPress={()=>navigation.navigate('Sign Up')}>
                <Text style={styles.signupLink}>Sign up here</Text> 
            </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    bottom:50
  },
  error: {
    marginTop: 10,
    color: 'red'
  },
  signupLink: {
    color: 'blue',
    marginLeft:10,
    marginTop: 15
  }
});

export default SignInScreen;