import React from 'react';
import { Alert, View, Image, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, InputItem } from '@ant-design/react-native';
import Loading from '_src/components/Loading';
import images from '_src/assets/images';
import request from '_src/utils/request';
import formatErrors from '_src/utils/formatErrors';

class FinishTask extends React.Component {
  state = {
    endMile: null,
    loading: false
  }

  handlePress = () => {
    const { task, onSuccess, status } = this.props;
    const body = {
      data: {
        attributes: {
          status,
          end_mileage: this.state.endMile
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
    const { endMile, loading } = this.state;
    const { task } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Image source={images.icon} style={styles.image}/>
          <InputItem
            disabled={loading}
            extra="KM"
            clear
            type="number"
            value={endMile}
            onChange={(value) => this.setState({ endMile: value})}
            placeholder="里程数"
          >
            结束
          </InputItem>
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
    width: 300,
    left: '50%',
    marginLeft: -150,
    alignItems: 'center',
    justifyContent:'center',
  },
  image: {
    width: 120,
    height: 114,
    marginBottom: 30
  },
  button: {
    marginTop: 10,
    marginLeft: 10,
    width: 290
  }
};

export default FinishTask;
