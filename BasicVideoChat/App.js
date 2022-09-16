import React, {useMemo, useState} from 'react';
import {Alert, View, Text, TouchableOpacity} from 'react-native';
import {OTSession, OTPublisher, OTSubscriber} from 'opentok-react-native';

const App = () => {
  const [StreamProperties, setStreamProperties] = useState({});
  const [VideoEnabled, setVideoEnabled] = useState(false);
  const apiKey = '47195624';
  const sessionId =
    '1_MX40NzE5NTYyNH5-MTY2MzM0MjI0MzE2Mn54QUlJalJzbGNEMkcwN0puaGJsTkhKN1B-fg';
  const token =
    'T1==cGFydG5lcl9pZD00NzE5NTYyNCZzaWc9MWJlM2RjZjJlZGEzNDJhMWQyZTdlNTNiNzdkZTY4OWE4MWRkZjc2NjpzZXNzaW9uX2lkPTFfTVg0ME56RTVOVFl5Tkg1LU1UWTJNek0wTWpJME16RTJNbjU0UVVsSmFsSnpiR05FTWtjd04wcHVhR0pzVGtoS04xQi1mZyZjcmVhdGVfdGltZT0xNjYzMzQyMjQzJm5vbmNlPTAuMjI2MTkxMjM1MzM5NDU1NzMmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTY2MzM0NTg0MyZjb25uZWN0aW9uX2RhdGE9cm9sZSUzRG1vZGVyYXRvciZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

  const sessionEventHandlers = useMemo(
    () => ({
      streamCreated(event) {
        setVideoEnabled(true);
        setStreamProperties(previousStreamProperties => ({
          ...previousStreamProperties,
          [event.streamId]: {
            subscribeToAudio: false,
            subscribeToVideo: false,
          },
        }));
      },
      streamDestroyed(event) {
        setStreamProperties(previousStreamProperties => {
          const newStreamProperties = {...previousStreamProperties};
          delete newStreamProperties[event.streamId];
          return newStreamProperties;
        });
      },
      signal(event) {},
      error(err) {
        Alert.alert('error', 'connects');
        console.info('Session error: ', err);
      },
    }),
    [],
  );

  const publisherEventHandlers = useMemo(
    () => ({
      streamCreated() {
        setVideoEnabled(true);
      },
      error() {
        Alert.alert('testin', 'handler');
        console.info('Error!');
      },
    }),
    [],
  );

  const publisherProperties = useMemo(
    () => ({
      cameraPosition: 'front',
      publishVideo: VideoEnabled,
      publishAudio: false,
      videoSource: 'camera',
    }),
    [VideoEnabled],
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 100,
        paddingVertical: 50,
      }}>
      <Text
        style={{
          color: '#000',
          fontSize: 20,
        }}>{`Video enable: ${VideoEnabled}`}</Text>
      <TouchableOpacity onPress={() => setVideoEnabled(!VideoEnabled)}>
        <Text
          style={{
            color: '#000',
            fontSize: 20,
          }}>
          {`Disable cam ${VideoEnabled}`}
        </Text>
      </TouchableOpacity>
      <OTSession
        apiKey={apiKey}
        sessionId={sessionId}
        token={token}
        eventHandlers={sessionEventHandlers}>
        <OTPublisher
          eventHandlers={publisherEventHandlers}
          style={{width: 200, height: 200}}
          properties={publisherProperties}
        />
        <OTSubscriber
          style={{width: 100, height: 100}}
          properties={StreamProperties}
        />
      </OTSession>
    </View>
  );
};

export default App;
