import React, { Component } from "react";
import { TouchableHighlight, StyleSheet, ScrollView, View, Text, Alert } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronCircleRight as faRight, faChevronCircleLeft as faLeft } from '@fortawesome/free-solid-svg-icons';
import GridView from '_src/components/GridView';
import DevicePanel from '_src/components/DevicePanel';
import LoadingModal from '_src/modals/LoadingModal';
import request from '_src/utils/request';
import { Theme } from '_src/constants';
import Loading from '_src/components/Loading';
import Logger from '_src/logger';
const logger = new Logger('DevicesLayoutContainer');

const DEVICE = 'device';
const DEVICES = 'devices';
class DevicesLayoutContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      devices: [],
      height: 0,
      kitchens: [],
      loading: true,
      loadingText: '加载厨房数据',
      newDevice: null,
      unnassigned: {},
      width: 0
    };
  }

  async componentDidMount() {
    const { data } = await this.fetchKitchens();
    logger.info(data);
    if (data.length > 0) {
      this.setState({
        kitchens: data,
        loading: false,
        devices: this.getCurrentKitchenDevices(data[0])
      });
    } else {
      this.setState({
        kitchens: data,
        loading: false
      });
    }
  }

  fetchKitchens = () => {
    return request({
      path: '/api/v1/rpc/current_kitchens',
      method: 'GET'
    }).catch(error => {
      logger.error(error);
      Alert.alert('错误', '服务器错误');
      this.setState({ loading: false });
    });
  }

  getCurrentKitchenDevices = (kitchen) => {
    if (!kitchen) return;
    return kitchen[DEVICES] || [];
  }

  getCurrentKitchenUnassigned = (kitchen) => {
    if (!kitchen) return;
    return kitchen.uninstalled || {};
  }

  handleChangeKitchen = (index) => {
    this.setState({loading: true}, async () => {
      const { data } = await this.fetchKitchens();
      if (data.length > 0) {
        this.setState({
          kitchens: data,
          loading: false,
          devices: this.getCurrentKitchenDevices(data[index]),
          currentIndex: index,
          newDevice: null,
          loadingText: '载入厨房数据'
        });
      }
    });
  }

  handleClickLeft = () => {
    const { currentIndex } = this.state;
    if (currentIndex >= 1) {
      this.handleChangeKitchen(currentIndex - 1);
    }
  }

  handleClickRight = () => {
    const { currentIndex, kitchens } = this.state;
    if (currentIndex + 1 < kitchens.length) {
      this.handleChangeKitchen(currentIndex + 1);
    }
  }

  handleClickToAdd = (name) => {
    const { category } = this.props;
    if (category === 'aftersale') {
      return;
    }
    const { currentIndex, kitchens, newDevice } = this.state;
    const currentKitchen = kitchens[currentIndex];

    if (newDevice) {
      Alert.alert('警告', '当前新添加的厨房设备未保存');
      return;
    }
    this.setState({
      newDevice: name
    });
  }

  handleDelete = (id) => {
    const { currentIndex } = this.state;
    if (!id) {
      this.setState({ newDevice: null });
      return;
    }
    this.setState(
      {
        loading: true,
        loadingText: '删除设备'
      }, async () => {
      logger.info(`delete item ${id}`);
      const response = await request({
        path: `/api/v1/${DEVICES}/${id}`,
        method: 'DELETE'
      }).catch(this.defaultFail);
      const { data } = await this.fetchKitchens();
      if (data.length > 0) {
        this.setState({
          kitchens: data,
          loading: false,
          devices: this.getCurrentKitchenDevices(data[currentIndex]),
          newDevice: null
        });
      }
    });
  }

  handleGridReady = (event) => {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height
    });
  }

  hasConflict(devices) {
    const matrix = [...Array(9)].map(elem => [...Array(15)].map (e => 0));
    devices.forEach(i => {
      // in react x,y start with 1, while array index start with 0
      const x = i.xPosition - 1;
      const y = i.yPosition - 1;
      matrix[y][x] += 1;
      if (i.shape === 2) {
        const dx = i.direction === 'vertical' ? 0 : 1;
        const dy = i.direction === 'vertical' ? 1 : 0;
        matrix[y + dy][x + dx] += 1;
      }
    });
    return matrix.filter(row => row.filter(i => i > 1).length > 0).length > 0;
  }

  defaultFail = (error) => {
    Alert.alert(error.response);
    this.setState({ loading: false });
  }

  handleLockAndSave = (item) => {
    const { devices } = this.state;
    const { id, xPosition, yPosition, direction, code, shape, status } = item;
    item.unlock = false;
    let newItem = true;
    const updatedDevices = devices.map(i => {
      if ((i.id && i.id === id) || i.unlock) {
        newItem = false
        return item;
      }
      return i;
    });

    const newDevices = newItem ? [...updatedDevices, item] : updatedDevices;
    logger.info(`lock should check if has conflict; ${this.hasConflict(newDevices)}`);
    logger.info(newDevices);
    if (this.hasConflict(newDevices)) {
      Alert.alert('警告', '位置冲突，无法锁定');
    } else {
      logger.info('locking item');
      this.setState({
        loading: true,
        loadingText: id ? '更新厨具位置' : '创建厨具'
      }, async () => {
        if (id) {
          logger.info('update item');
          logger.info(JSON.stringify(newDevices));
          await this.handleUpdateDevice(item);
          this.setState({
            loading: false,
            devices: newDevices,
            newDevice: null
          });
        } else {
          logger.info('create item');
          const { id } = await this.handleCreateDevice(item);
          item.id = id;
          this.setState({
            loading: false,
            devices: [...updatedDevices, item],
            newDevice: null
          });
        }
      });
    }
  }

  handleCreateDevice = (item) => {
    const { id } = this.props;
    const { devices, kitchens, currentIndex } = this.state;
    const { xPosition, yPosition, direction, code, shape } = item;
    const kitchen = kitchens[currentIndex];
    const body = {
      data: {
        attributes: {
          field_task_id: id,
          kitchen_id: kitchen.id,
          organisation_id: kitchen.organisation_id,
          start_x: xPosition - 1,
          start_y: yPosition - 1,
          direction,
          code
        },
        type: DEVICE
      }
    };
    return request({
      path: `/api/v1/${DEVICES}`,
      method: 'POST',
      body: JSON.stringify(body)
    }).catch(this.defaultFail);
  }

  handleUpdateDevice = (item) => {
    const { devices, kitchens, currentIndex } = this.state;
    const { id, xPosition, yPosition, direction } = item;
    const kitchen = kitchens[currentIndex];
    const body = {
      data: {
        attributes: {
          start_x: xPosition - 1,
          start_y: yPosition - 1,
          direction
        },
        type: DEVICE
      }
    };
    return request({
      path: `/api/v1/${DEVICES}/${id}`,
      method: 'PATCH',
      body: JSON.stringify(body)
    }).catch(this.defaultFail);
  }

  handleUnlock = (item) => {
    const { id, xPosition, yPosition } = item;
    const { devices, newDevice } = this.state;
    if (newDevice) {
      Alert.alert('还有没锁定的设备');
      return;
    }
    const unlocked = devices.filter(i => i.unlock).length;
    if (unlocked > 0) {
      Alert.alert('请先锁定其他设备再解锁');
      return;
    } else {
      logger.info('Unlock item');
      logger.info('##########' + JSON.stringify(item));
      logger.info('##########' + JSON.stringify(devices));
      const newDevices = devices.map(i => {
        if (i.id === id || (i.xPosition === xPosition && i.yPosition === yPosition)) {
          i.unlock = true
        }
        return i
      });
      logger.info(newDevices);
      this.setState({
        devices: newDevices,
      });
    }
  }

  renderArrow = (icon, onPress) => (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={onPress}>
      <FontAwesomeIcon icon={icon} color={Theme.pGreen} style={styles.faArrow} />
    </TouchableHighlight>
  );

  renderGridView = () => {
    const { loading, width, height, currentIndex, newDevice, kitchens, devices } = this.state;
    const { category } = this.props;
    const length = kitchens.length;
    const currentKitchen = kitchens[currentIndex];
    if (currentKitchen) {
      const title = `${currentKitchen.name} ${currentIndex + 1}/${length}`;
      const showLeft = !newDevice && currentIndex > 0;
      const showRight = !newDevice && currentIndex < length - 1;
      return (
        <GridView
          category={category || 'install'}
          height={height}
          width={width}
          title={title}
          kitchen={currentKitchen}
          devices={devices}
          newDevice={newDevice}
          onDelete={this.handleDelete}
          onLock={this.handleLockAndSave}
          onUnlock={this.handleUnlock}
        />
      );
    } else if (!loading) {
      return (
        <View style={{padding: 20}}>
          <Text>该任务没有对应的厨房信息，请联系后台添加</Text>
        </View>
      );
    }
  }

  renderLoading() {
    const { loading, loadingText } = this.state;
    const { loadingStyle } = this.props;
    if (loadingStyle == 'inline') {
      return (
        <View style={{position: 'absolute'}}><Loading /></View>
      );
    } else {
      return (
        <LoadingModal
          debounce={300}
          isOpen={loading}
          text={loadingText}
        />
      );
    }
  }
  render() {
    const { currentIndex, newDevice, kitchens, loading, loadingText } = this.state;
    const { category, disabled, loadingStyle } = this.props;
    const length = kitchens.length;
    const showLeft = !newDevice && currentIndex > 0;
    const showRight = !newDevice && currentIndex < length - 1;
    return (
      <View
        style={[styles.columnFlex]}>
        <View
          onLayout={(event) => this.handleGridReady(event)}
          style={[styles.outer, styles.border, {flex: 3, marginBottom: 10}]}>

          {loading && this.renderLoading()}
          {this.renderGridView()}
          <View style={[styles.arrow, { left: 5 }]}>
            {showLeft && this.renderArrow(faLeft, this.handleClickLeft)}
          </View>
          <View style={[styles.arrow, { right: 5 }]}>
            {showRight && this.renderArrow(faRight, this.handleClickRight)}
          </View>
        </View>
        <View style={[styles.border, { flex: 1 }]}>
          <ScrollView contentContainerStyle={styles.devicePanelContainer}>
            <DevicePanel
              onClickToAdd={this.handleClickToAdd}
              onRelease={() => logger.info('released')}
              disabled={ disabled }
            />
         </ScrollView>
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    backgroundColor: Theme.light,
  },
  columnFlex: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mRgt: {
    marginRight: 10
  },
  mBtm: {
    marginBottom: 10
  },
  border: {
    borderRadius: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000'
  },
  devicePanelContainer: {
    minHeight: '100%',
    justifyContent:'center',
    alignItems: 'center'
  },
  arrow: {
    position: 'absolute',
    height: '100%',
    justifyContent:'center',
    alignItems: 'center'
  },
  faArrow: {
    padding: 15
  }
});
export default DevicesLayoutContainer;
