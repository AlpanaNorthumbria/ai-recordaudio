import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, Button } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { firebase } from '../config';
import { getStorage, ref, updateMetadata } from "firebase/storage";


const UploadScreen = () => {
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [message, setMessage] = React.useState("");
    const [uploading, setuploading] = useState(false);

    async function startRecording() {
        try {
          const permission = await Audio.requestPermissionsAsync();
    
          if (permission.status === "granted") {
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,
              playsInSilentModeIOS: true
            });
            
            const { recording } = await Audio.Recording.createAsync(
              Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
    
            setRecording(recording);
          } else {
            setMessage("Please grant permission to app to access microphone");
          }
        } catch (err) {
          console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
    
        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.getURI()
        });
    
        setRecordings(updatedRecordings);
    }
    
    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
          return (
            <View key={index} style={styles.row}>
              <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
              <Button style={styles.buttonPlay} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
              <TouchableOpacity style={styles.buttonUpload} onPress={uploadAudio(index)} >
                    <Text style={styles.buttonText}>
                        Send
                    </Text>
                </TouchableOpacity>
            </View>
          );
        });
      }

    // const uploadAudio = async () => {
    //     setuploading(true);
    //     const response = await fetch(image.uri)
    //     const blob = await response.blob();
    //     const filename = image.uri.substring(image.uri.lastIndexOf('/')+1);
    //     var ref = firebase.storage().ref().child(filename).put(blob);

    //     try {
    //         await ref;
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     setuploading(false);
    //     Alert.alert(
    //         'Photo Uploaded..!!'
    //     );
    //     setImage(null);
    // };

    const uploadAudio = async (index) => {
        console.log('URI:', recordings[index].file)
        const uri = recordings[index].file;
       // const uri = await fetch(recordings.uri)
        try {
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
              try {
                resolve(xhr.response);
              } catch (error) {
                console.log("error:", error);
              }
            };
            xhr.onerror = (e) => {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
          });
          if (blob != null) {
            const uriParts = uri.split(".");
            const uriPathParts = uri.split("/");

            const fileName = uriPathParts[uriPathParts.length - 1];
            const fileType = uriParts[uriParts.length - 1];
            //alpana changes -- adding metadata for each audio with patient details
            const metadata = {
              customMetadata: {
                'name' : 'Alpana',
                'location': 'Yosemite, CA, USA',
                'DateTime': getStorage.DateTime
              }
            };
            //ends
            const getRef = firebase
              .storage()
              .ref()
              .child(`${fileName}`)
              .put(blob, {
                contentType: `audio/${fileType}`,
              })
              .then (()=> {
                console.log("Sent!");
              })
              .catch((e) => console.log("error:", e));
          } else {
            console.log("erroor with blob");
          }
        } catch (error) {
          console.log("error:", error);
        }
    };

    return (
       <SafeAreaView style={styles.container}>
            <Text>{message}</Text>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording} />
            {getRecordingLines()}
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}

export default UploadScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#fff',
        justifyContent:'center'
    },
    selectButton: {
        borderRadius:5,
        width:150,
        height:150,
        backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center'
    },
    uploadButton: {
        borderRadius:5,
        width:150,
        height:50,
        backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonPlay: {
        color:'#00FF00',
        fontSize:18,
        fontWeight:'bold',
        marginTop: 20
    },
    buttonUpload: {
        fontSize:18,
        fontWeight:'bold',
        marginTop: 20,
        borderRadius:5,
        width:150,
        height:50,
        backgroundColor:'#0000FF',
        alignItems:'center',
        justifyContent:'center'

    },
    buttonText: {
        color:'white',
        fontSize:18,
        fontWeight:'bold'
    }

})

