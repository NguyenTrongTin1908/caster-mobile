import * as React from 'react';
import { Image, Alert, TouchableOpacity, View } from 'react-native';
import { mediaService } from 'services/media.service';
import * as ImagePicker from 'expo-image-picker';

const staticUrl = require('assets/default-avatar.png');

interface Props {
  uploadUrl: string;
  mediaUrl?: string;
}

class UploadMedia extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      mediaUrl: '',
      updating: false,
      progress: 0
    };
  }

  async getPermissionAsync() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Notification',
        'Sorry, we need camera roll permissions to make this work!'
      );
      return false;
    }

    return true;
  }

  async pickImage() {
    const hasPermission = await this.getPermissionAsync();
    if (!hasPermission) {
      return;
    }
    
    const result = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All // todo -should images only
      // allowsEditing: true,
      // aspect: [4, 3],
    })) as any;
    if (!result.cancelled) {
      try {
        //todo - do upload function
        this.setState({ updating: true });
        const data = await this._upload(result);
      } catch (error) {
        if (error.response) {
          const data = error.response.data;
          Alert.alert(
            'Notification',
            data && data.data && data.data.msg
              ? data.data.msg
              : 'Something went wrong, please try again later!'
          );
        } else if (error.request) {
          Alert.alert('Notification', 'No response was received');
        } else {
          Alert.alert(
            'Notification',
            'Something went wrong, please try again later!'
          );
        }
      }
    }
  }

  public _upload(file: any) {
    try {
      const { uploadUrl: url } = this.props;
      this.setState({ uploaded: false }, async () => {
        const result = await mediaService
          .axiosUpload({
            url,
            file: { uri: file.uri },
            onUploadProgress: (progressEvent: any) => {
              this.setState({
                progress: progressEvent.loaded / progressEvent.total
              });
            }
          })
          .catch((e) => {
            throw e;
          });
        return result;
      });
    } catch (e) {
      throw e;
    }
  }

  render() {
    const { mediaUrl } = this.state;
    return (
      <TouchableOpacity
        style={{  }}
        onPress={this.pickImage.bind(this)}>
        <View style={{}}>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              opacity: this.state.updating ? 0.2 : 1,
              borderWidth: 3,
              borderColor: '#fff'
            }}
            source={mediaUrl ? { uri: mediaUrl } : staticUrl}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default UploadMedia;
