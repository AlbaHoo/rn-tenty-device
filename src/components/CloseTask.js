import React from 'react';
import { Alert, View, Image, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, TextareaItem } from '@ant-design/react-native';
import Loading from '_src/components/Loading';
import images from '_src/assets/images';
import request from '_src/utils/request';
import formatErrors from '_src/utils/formatErrors';

class FinishTask extends React.Component {
  state = {
    reason: null,
    loading: false
  }

  handlePress = () => {
    const { task, onSuccess, status } = this.props;
    const body = {
      data: {
        attributes: {
          status,
          close_reason: this.state.reason
        },
        type: 'field_task'
      }
    };

    this.setState({loading: true}, () => {
      request({
        path: `/api/v1/field_tasks/${task.id}`,
        method: 'PATCH',
        body: JSON.stringify(body)
      }).then(({ data }) => {
        console.log(data);
        this.setState({ loading: false }, () => onSuccess && onSuccess());
      }).catch(error => {
        const errors = error?.response?.errors;
        const message =  errors ? formatErrors(errors) : JSON.stringify(error);
        Alert.alert('错误', message);
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { reason, loading } = this.state;
    const { task } = this.props;
    const label = '关闭任务原因';
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Image source={images.icon} style={styles.image}/>
          <TextareaItem
            disabled={loading}
            style={styles.textarea}
            rows={5}
            title={label}
            placeholder={label}
            value={reason}
            onChange={(value) => this.setState({ reason: value})}
            editable={true}
          />
          {loading
            ? <Loading />
            : (
              <Button
                style={styles.button}
                size="large"
                onPress={ this.handlePress }
              >
                完成任务
              </Button>
            )
          }
        </View>
      </View>
    );
  }
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  main: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
  },
  textarea: {
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#f1f1f1',
    borderRadius: 5,
    width: 300
  },
  image: {
    width: 120,
    height: 114,
    marginBottom: 30
  },
  button: {
    marginTop: 10,
    width: 300
  }
};

export default FinishTask;
