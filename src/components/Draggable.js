import React, { Component } from "react";
import { Alert, Image, StyleSheet, View, Text, PanResponder, Animated } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { has } from 'lodash'
import { Actions } from 'react-native-router-flux';
import { InputItem } from '@ant-design/react-native';
import { TaskContext } from '_src/context/TaskProvider';
import { Theme } from '_src/constants';
import DeviceSvg from '_src/assets/svg.js';
import ResourceSelector from '_src/containers/ResourceSelector';
import EditResourceModal from '_src/modals/EditResourceModal';
import CreateResourceModal from '_src/modals/CreateResourceModal';
import images from '_src/assets/images';
import deviceInfo from '_src/utils/deviceInfo';
import Logger from '_src/logger';
const logger = new Logger('Draggable');

const MAX_X = 15;
const MAX_Y = 9;

const repairRecordUiSchema = [
  {
    label: '维修类型',
    name: 'operation',
    widget: 'select',
    options: [
      {
        label: '无需维修',
        value: ''
      },
      {
        label: '替换配件',
        value: 'replace'
      },
      {
        label: '修理配件',
        value: 'repair'
      }
    ]
  },
  {
    label: '配件数量',
    name: 'component_number',
    hide: (attributes) => !attributes.operation,
    type: 'number',
    widget: 'input'
  },
  {
    label: '配件类型',
    name: 'component_model_id',
    hide: (attributes) => !attributes.operation,
    widget: ({ onChange, value, editable }) => (
      <ResourceSelector
        editable={editable}
        onChange={onChange}
        title="配件种类"
        placeholder="-- 选择配件种类 --"
        remotePath="component_models"
        labelKey="name"
        selectedValue={value}
      />
    ),
  },
  {
    label: '备注',
    name: 'description',
    widget: 'textarea'
  },
];
const oldDeviceUiSchema = (deviceName) => {

  const isPintai = () => (deviceName === 'pintai');
  return [{
    label: '名牌',
    hide: isPintai,
    name: 'brand',
    widget: 'input'
  },
  {
    label: '是否节能',
    hide: isPintai,
    name: 'is_green',
    widget: 'checkbox'
  },
  {
    label: '宽度mm',
    name: 'width',
    type: 'number',
    widget: 'input'
  },
  {
    label: '高度mm',
    name: 'height',
    type: 'number',
    widget: 'input'
  },
  {
    label: '长度mm',
    name: 'length',
    type: 'number',
    widget: 'input'
  },
  {
    label: '能耗测试方式',
    hide: isPintai,
    name: 'measurement_id',
    widget: ({ value, onChange }) => (
      <ResourceSelector
        onChange={onChange}
        title="测试方式"
        placeholder="-- 选择测试方式 --"
        remotePath="measurements"
        selectedValue={value}
      />
    ),
  },
  {
    label: '测试类型',
    name: 'measure_type',
    hide: isPintai,
    widget: 'select',
    options: [
      {
        label: '冷膛炉',
        value: 'cold'
      },
      {
        label: '热膛炉',
        value: 'hot'
      }
    ]
  },
  {
    label: '燃气用量',
    hide: isPintai,
    name: 'measure_usage',
    type: 'number',
    extra: '立方米',
    widget: 'input'
  },
  {
    label: '测试时间',
    hide: isPintai,
    width: '50%',
    name: 'measure_time',
    type: 'number',
    extra: '秒',
    widget: ({ editable, value, onChange }) => {
      const seconds = parseInt(value || 0);
      const minute = Math.floor(seconds / 60);
      const second = seconds % 60;
      console.log(`all: ${seconds}, m: ${minute}, s:${second}`);
      return (
        <View style={styles.rowFlex}>
          <View style={{flex: 1}}>
            <InputItem
              style={editable ? styles.editModeInput : styles.readModeInput}
              type={'number'}
              clear
              value={String(minute)}
              extra="分"
              onChange={v => onChange(parseInt(v || 0) * 60 + second)}
              placeholder={'分'}
              editable={editable}
            />
          </View>
          <View style={{flex: 1}}>
            <InputItem
              style={editable ? styles.editModeInput : styles.readModeInput}
              type={'number'}
              clear
              value={String(second)}
              extra="秒"
              onChange={v => onChange(parseInt(v || 0) + 60 * minute)}
              placeholder={'秒'}
              editable={editable}
            />
          </View>
        </View>
      );
    },
  }];
};

class Draggable extends Component {
  constructor(props) {
    super(props);

    const { id, status, unlock, vertical, xPosition, yPosition, icon } = this.props;
    this.mounted = false;
    this.state = {
      isOpenEditDevice: false,
      isOpenNewRecord: false,
      isOpenActivateDevice: false,
      isOpenEditPintai: false,
      id: id,
      xPosition: xPosition || 0,
      yPosition: yPosition || 0,
      device: deviceInfo.getDeviceInfo(icon, vertical || false),
      showDraggable: true,
      status: status,
      unlock: unlock,
      menuOpened: false,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentDidMount(){
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillMount() {
    this.createPanResponder();
  }

  createPanResponder = () => {
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener((value) => this._val = value);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y:this._val.y
        })
        this.state.pan.setValue({ x:0, y:0})
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!this.state.unlock) return;
        return Animated.event([null, {
          dx: this.state.pan.x,
          dy: this.state.pan.y,
        }])(evt, gestureState);
      },

      onPanResponderRelease: (e, gesture) => {
        const threshold = 5;
        const { unlock, menuOpened, device } = this.state;
        const { width, height } = this.props;
        const { xPosition, yPosition } = this.state;
        const movedX = gesture.moveX - gesture.x0;
        const movedY = gesture.moveY - gesture.y0;
        if (width === 0 || height === 0) {
          logger.info('width and height are not initialised');
          return;
        }
        // handle click open menu
        logger.info(`release gesture: ${JSON.stringify({gesture, menuOpened})}`);
        if (Math.abs(gesture.dx) < threshold && Math.abs(gesture.dy) < threshold && this.mounted) {
          this.setState({menuOpened: !menuOpened}, this.spring(0, 0));
          return;
        }
        if (!unlock) {
          logger.info(`item is locked, cannot move`);
          return;
        }
        logger.info('moving...');
        const xTile = Math.round(movedX / width);
        const yTile = Math.round(movedY / height);

        const newXPosition = xPosition + xTile;
        const newYPosition = yPosition + yTile;
        logger.info(`moved xTile: ${xTile}, yTile:${yTile}, newX: ${newXPosition} newY: ${newYPosition}`);
        const xMax = MAX_X - device.wf + 1;
        const yMax = MAX_Y - device.hf + 1;
        if (this.mounted && newXPosition > 0 && newYPosition > 0 && newXPosition <= xMax && newYPosition <= yMax ) {
          this.setState({
            xPosition: newXPosition,
            yPosition: newYPosition
          }, () => {
            this.spring(width * xTile, height * yTile);
          });
        } else {
          this.spring(0, 0);
        }
      }
    });
  }

  spring = (x, y) => {
    Animated.spring(this.state.pan, {
      toValue: { x, y },
      friction: 5
    }).start();
  }

  timing = (duration) => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: duration
    }).start(() =>
      this.setState({
        showDraggable: false
      })
    );
  }

  isInLayout = (device, xPosition, yPosition) => {
    const xMax = MAX_X - device.wf + 1;
    const yMax = MAX_Y - device.hf + 1;
    if (xPosition > 0 && xPosition > 0 && xPosition <= xMax && yPosition <= yMax ) {
      return true;
    } else {
      return false;
    }
  }

  // moved into src/utils/deviceInfo
  getDeviceInfo(name, vertical) {
    const oneTileDevices = ['aizai1', 'chao1', 'chao3', 'zhenggui', 'changfenlu', 'zhengglu'];
    const twoTileDevices = ['aizai2', 'chao2'];
    if (oneTileDevices.includes(name)) {
      return { name, wf: 1, hf: 1 };
    } else if (twoTileDevices.includes(name)) {
      const wf = vertical ? 1 : 2;
      const hf = vertical ? 2 : 1;
      return { name, vertical, wf, hf };
    } else {
      logger.error(`unknow device name: ${name}`);
      // return { name: ''}
      return { name: 'aizai2', wf: 2, hf: 1};
    }
  }

  handleActivateDevice(id) {
    const { onDelete } = this.props;
    const actions = [
      {
        text: '取消',
        style: "cancel"
      },
      {
        text: '确认删除',
        onPress: () => onDelete && onDelete(id),
        style: 'cancel'
      }
    ];
    Alert.alert(
      '警告',
      '确认要删除改设备吗？',
      actions,
      { cancelable: false }
    );
  }

  handleDeleteDevice(id) {
    const { onDelete } = this.props;
    const actions = [
      {
        text: '取消',
        style: "cancel"
      },
      {
        text: '确认删除',
        onPress: () => onDelete && onDelete(id),
        style: 'cancel'
      }
    ];
    Alert.alert(
      '警告',
      '确认要删除改设备吗？',
      actions,
      { cancelable: false }
    );
  }

  handleLock = () => {
    const { onLock } = this.props;
    const { id, xPosition, yPosition, device, status } = this.state;
    if (this.isInLayout(device, xPosition, yPosition)) {
      this.setState({ menuOpened: false }, () => {
        onLock && onLock({
          id,
          xPosition,
          yPosition,
          status,
          direction: device.vertical ? 'vertical' : 'horizontal',
          shape: device.wf * device.hf,
          code: device.name
        });
      });
    }
  }

  handleRotate = () => {
    const { onRotate } = this.props;
    const { id, xPosition, yPosition, device } = this.state;
    const vertical = device.vertical || false;
    const newDevice = deviceInfo.getDeviceInfo(device.name, !vertical);
    if (this.isInLayout(newDevice, xPosition, yPosition)) {
      logger.info('Rotate...');
      this.setState({device: newDevice});
    } else {
      Alert.alert('警告', '超出边界，无法旋转');
    }
  }

  handleUnlock = () => {
    const { onUnlock } = this.props;
    const { id, xPosition, yPosition} = this.state;
    this.setState({ menuOpened: false }, () => {
      onUnlock && onUnlock({id, xPosition, yPosition});
    });
  }

  renderPositionMenu = () => {
    const { device, unlock, xPosition, yPosition, id } = this.state;
    const showRotate = has(device, 'vertical') && unlock;
    const showLock = this.isInLayout(device, xPosition, yPosition) && unlock;
    const showMove = !unlock;
    return (
      <>
        <MenuOption onSelect={this.handleRotate} disabled={!showRotate} text="旋转" />
        <MenuOption onSelect={this.handleLock} disabled={!showLock} text="锁定" />
        <MenuOption onSelect={this.handleUnlock} disabled={!showMove} text="移动" />
      </>
    );
  };

  renderCheckoutMenu = () => {
    const { unlock, id } = this.state;
    const showEdit = !unlock && id;
    return (
      <>
        <MenuOption onSelect={() => this.setState({isOpenEditDevice: true, menuOpened: false})} disabled={!showEdit} text="编辑" />
      </>
    );
  }

  renderPintaiMenu = () => {
    return (
      <>
        <MenuOption onSelect={() => this.setState({isOpenEditPintai: true, menuOpened: false})} text="编辑拼台" />
      </>
    );
  }

  renderDeleteMenu = (id) => {
    return (
      <>
        <MenuOption onSelect={() => this.handleDeleteDevice(id)} text="删除" />
      </>
    );
  }

  renderInstallMenu = () => {
    const { status, id } = this.state;
    const showActivate = status === 'pending' && id;
    const text = status === 'pending' && id ? '激活' : '重新激活'
    return (
      <>
        <MenuOption onSelect={() => this.setState({isOpenActivateDevice: true, menuOpened: false})} text={text} />
      </>
    );
  }

  renderAftersaleMenu = () => {
    const goToRepaires = () => {
      this.setState({ menuOpened: false }, () => Actions.repaires({ deviceId: this.state.id }));
    }
    return (
      <>
        <MenuOption onSelect={() => this.setState({isOpenNewRecord: true, menuOpened: false})} text="添加维修记录" />
        <MenuOption onSelect={goToRepaires} text="历史维修记录" />
      </>
    );
  }

  renderMenu = (taskId, category) => {
    const { menuOpened, device, unlock, xPosition, yPosition, id, isOpenEditDevice, isOpenNewRecord } = this.state;
    const showRotate = has(device, 'vertical') && unlock;
    const showLock = this.isInLayout(device, xPosition, yPosition) && unlock;
    const showMove = !unlock;
    const showEdit = !unlock && id;

    const isCheckout = category === 'checkout';
    const isInstall = category === 'install';
    const isPreInstall = category === 'preInstall';
    const isAftersale = category === 'aftersale';
    const isPintai = device.name === 'pintai';

    return (
      <View>
        <Menu
          opened={menuOpened}
          onBackdropPress={() => this.setState({menuOpened: false})}
        >
          <MenuTrigger />
          <MenuOptions customStyles={optionsStyles}>
            {(!isAftersale) && this.renderPositionMenu()}
            {isPreInstall && isPintai && this.renderPintaiMenu()}
            {isCheckout && this.renderCheckoutMenu()}
            {(isCheckout || isPreInstall) && this.renderDeleteMenu(id)}
            {isInstall && this.renderInstallMenu()}
            {isAftersale && !isPintai && this.renderAftersaleMenu()}
          </MenuOptions>
        </Menu>
      </View>
    );
  }

  getColor(category, scannedDeviceIds) {
    const { id } = this.props;
    const { status, unlock } = this.state;
    switch(category) {
      case 'aftersale':
        const scanned = scannedDeviceIds.includes(id);
        return scanned ? 'black' : 'darkred';
      case 'install':
        const pending = status === 'pending';
        if (unlock) return 'red';
        return pending ? 'blue' : 'black';
      case 'checkout':
      case 'preInstall':
        return unlock ? 'red' : 'black';
      default:
        return 'black';
    }
  }

  renderDraggable(taskId, category, scannedDeviceIds) {
    const { id, width, height, icon, xPosition, yPosition, disabled } = this.props;
    const left = (xPosition || 0) * width;
    const top = (yPosition || 0) * height;
    const { device, unlock, isOpenEditDevice, isOpenEditPintai, isOpenNewRecord, isOpenActivateDevice } = this.state;
    const unscanned = category === 'aftersale' && !scannedDeviceIds.includes(id);
    const color = this.getColor(category, scannedDeviceIds)
    // outer dragger width and height
    const w =  (width || 50) * device.wf * 1.1;
    const h =  (height || 50) * device.hf * 1.1;
    // inner icon svg
    const iw = width * device.wf;
    const ih = height * device.hf;
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    const activateDeviceUiSchema = [
      {
        label: '设备型号',
        name: 'device_secondary_model_id',
        widget: ({ onChange, value, editable }) => (
          <ResourceSelector
            editable={editable}
            onChange={onChange}
            title="型号"
            placeholder={device.name === 'pintai' ? '拼台可直接安卓' : '-- 选择型号 --'}
            remotePath={`device_secondary_models?filter[device_id]=${id}`}
            labelKey="name"
            selectedValue={value}
          />
        ),
      },
    ];

    const toStatus = device.name === 'pintai' ? 'installed' : 'confirmed';

    if (this.state.showDraggable) {
      return (
        <View style={{left: left, top: top, position: "absolute" }}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle, styles.imageContainer, {opacity:this.state.opacity}]}
          >
            <View style={[styles.image, {height: h, width: w}]}>
              <DeviceSvg name={device.name} color={color} vertical={device.vertical} height={ih} width={iw}/>
              {!disabled && this.renderMenu(taskId, category)}
            </View>
          </Animated.View>
          <EditResourceModal
            title={`${device.label}信息`}
            isOpen={isOpenEditDevice}
            resources="old_devices"
            resource="old_device"
            id={id}
            onClose={()=> this.setState({isOpenEditDevice: false})}
            onAfterSubmit={()=> this.setState({isOpenEditDevice: false})}
            uiSchema={oldDeviceUiSchema(device.name)}
          />
          <EditResourceModal
            title="选择型号激活"
            isOpen={isOpenActivateDevice}
            resources="devices"
            resource="device"
            id={id}
            onClose={()=> this.setState({isOpenActivateDevice: false})}
            onAfterSubmit={()=> this.setState({isOpenActivateDevice: false, status: toStatus})}
            uiSchema={activateDeviceUiSchema}
            submitLabel={device.name === 'pintai' ? '安装' : '激活'}
            extraAttributes={{
              status: toStatus,
              field_task_id: taskId
            }}
          />
          <EditResourceModal
            title="编辑拼台尺寸"
            isOpen={isOpenEditPintai}
            resources="devices"
            resource="device"
            id={id}
            onClose={()=> this.setState({isOpenEditPintai: false})}
            onAfterSubmit={()=> this.setState({isOpenEditPintai: false, status: 'confirmed'})}
            uiSchema={[{
              label: '拼台备注',
              name: 'description',
              widget: 'input'
            }]}
          />
          {isOpenNewRecord && (
            <CreateResourceModal
              initialAttributes={{
                device_id: id,
                field_task_id: taskId
              }}
              title="添加维修记录"
              mutatePath="/api/v1/repair_records"
              isOpen={true}
              resources={'repair_records'}
              uiSchema={repairRecordUiSchema}
              onClose={()=> this.setState({isOpenNewRecord: false})}
              onAfterSubmit={()=> this.setState({isOpenNewRecord: false})}
            />
          )}
        </View>
      );
    }
  }

  render() {
    // use props category first (checkout preinstall)
    return (
      <TaskContext.Consumer>
        {({taskId, category, scannedDeviceIds}) => (
          <View style={{width: "20%", alignItems: "center" }}>
            {this.renderDraggable(taskId, this.props.category || category, scannedDeviceIds)}
          </View>
        )}
      </TaskContext.Consumer>
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: Theme.light,
  },
  optionsWrapper: {
    backgroundColor: Theme.light,
  },
  optionWrapper: {
    minHeight: 40,
    backgroundColor: 'white',
    margin: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 50,
  },
  optionText: {
    lineHeight: 38,
    fontSize: 18,
    alignItems: 'center',
    textAlign: 'center',
  }
};

const styles = StyleSheet.create({
  rowFlex: {
    marginLeft: -6,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  editModeInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Theme.medium
  },
  mainContainer: {
    flex: 1
  },
  ballContainer: {
    height: 200
  },
  imageContainer: {
    alignItems: 'center',
    textAlign: 'center'
  },
  image: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17
  },
  row: {
    flexDirection: "row"
  },
  dropZone: {
    height: 200,
    backgroundColor: "#00334d"
  }
});
export default Draggable;
