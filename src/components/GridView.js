import React, { Component } from "react";
import { TouchableHighlight, StyleSheet, View, Text, PanResponder, Animated } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import { Theme } from '_src/constants';
import Draggable from '_src/components/Draggable';
import EditResourceModal from '_src/modals/EditResourceModal';
import OldDevicesPreviewModal from '_src/modals/OldDevicesPreviewModal';
import DevicesPreviewModal from '_src/modals/DevicesPreviewModal';
import Loading from '_src/components/Loading';
import Logger from '_src/logger';
const logger = new Logger('GridView');

const uiSchema = [
  {
    label: '名字',
    name: 'name',
    widget: 'input'
  },
  {
    label: '最窄宽度mm',
    name: 'min_width',
    type: 'number',
    widget: 'input'
  },
  {
    label: '最低高度mm',
    name: 'min_height',
    type: 'number',
    widget: 'input'
  },
  {
    label: '最短长度mm',
    name: 'min_length',
    type: 'number',
    widget: 'input'
  },
  {
    label: '楼层',
    name: 'level',
    type: 'number',
    widget: 'input'
  },
  {
    label: '有无电梯',
    name: 'has_lift',
    widget: 'checkbox'
  }
];
class GridView extends Component {
  constructor(props) {
    //devices: [{"code": "zhenggui", "direction": "horizontal", "id": undefined, "unlock": false, "shape": 2, "xPosition": 1, "yPosition": 1}],
    super(props);
    this.state = {
      loading: false,
      isOpenEditKitchen: false,
      isOpenOldDeviceLayout: false,
      isOpenDeviceLayout: false
    }
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

  handleEditKitchen = () => {
    this.setState({isOpenEditKitchen: true});
  }

  handleDelete = (id) => {
    const { onDelete } = this.props;
    onDelete && onDelete(id);
  }

  // item: {id, xPosition, yPosition, direction, code}
  handleLock = (item) => {
    const { onLock } = this.props;
    onLock && onLock(item);
  }

  handleUnlock = (item) => {
    const { onUnlock } = this.props;
    onUnlock && onUnlock(item);
  }

  renderCell = (index) => (
    <View key={index} style={[styles.borderInner, {flex: 1}]}>
    </View>
  );

  renderDevices = (tileX, tileY) => {
    const { devices, disabled, category } = this.props;
    return (devices || []).map((d, i) => {
      // refresh Draggable each time moving
      const key = `${d.id || i} -${d.unlock}`;
      return (
        <Draggable
          category={category}
          id={d.id}
          status={d.status}
          disabled={disabled}
          key={key}
          vertical={d.direction === 'vertical'}
          unlock={d.unlock}
          xPosition={d.xPosition}
          yPosition={d.yPosition}
          width={tileX}
          height={tileY}
          icon={d.code}
          onDelete={this.handleDelete}
          onLock={this.handleLock}
          onUnlock={this.handleUnlock}
        />
      )
    });
  }

  renderDraggableArea = () => {
    return [...Array(9).keys()].map(this.renderRow);
  }

  renderGrid = (width, height) => {
    const tileX = width / 17;
    const tileY = height / 10;
    const { newDevice, category } = this.props;
    return (
      <View style={[styles.outer, styles.border, { width, height }]}>
        <View>{this.renderDevices(tileX, tileY)}</View>
        <View style={[styles.rowFlex, {flex: 1}]}>
          <View style={[{flex: 2}]}>
            { newDevice && (
              <Draggable
                category={category}
                unlock={true}
                width={tileX}
                height={tileY}
                icon={newDevice}
                onDelete={this.handleDelete}
                onLock={this.handleLock}
                onUnlock={this.handleUnlock}
              />
            )}
          </View>
          <View style={[{alignItems: 'center', flex: 13}]}>
            {this.renderKitchenName()}
          </View>
          <View style={[{flex: 2}]}></View>
        </View>
        <View style={[styles.rowFlex, {flex: 9, zIndex: -1}]}>
          <View style={[styles.arrowContainer, {flex: 1}]}>
          </View>
          <View
            style={[styles.columnFlex, styles.inner, {flex: 15}]}>
            <View style={{position: 'absolute', width: '100%', height: '100%'}}>{this.renderDraggableArea()}</View>
          </View>
          <View style={[styles.arrowContainer, {flex: 1}]}>
          </View>
        </View>
      </View>
    );
  }

  renderKitchenName = () => {
    const { isOpenEditKitchen, isOpenOldDeviceLayout, isOpenDeviceLayout } = this.state;
    const { kitchen, title, disabled, width, height, category } = this.props;
    const isCheckout = category === 'checkout';
    const isInstall = category === 'install';
    const isPreInstall = category === 'preInstall';
    const isAftersale = category === 'aftersale';
    const kitchenId = kitchen?.id;
    return (
      <View>
        <Menu>
          <MenuTrigger text={title} customStyles={triggerStyles} disabled={disabled}/>
          <MenuOptions customStyles={optionsStyles}>
            {(isCheckout || isInstall) && <MenuOption onSelect={this.handleEditKitchen} text="编辑厨房信息" />}
            {isCheckout && <MenuOption onSelect={() => this.setState({isOpenDeviceLayout: true})} text="编辑预安装布局" />}
            {isInstall && <MenuOption onSelect={() => this.setState({isOpenOldDeviceLayout: true})} text="查看原厨具布局" />}
            {isAftersale && <MenuOption onSelect={() => Actions.scanDevices() } text="盘点厨具" />}
          </MenuOptions>
        </Menu>
        <EditResourceModal
          isOpen={isOpenEditKitchen}
          resources="kitchens"
          resource="kitchen"
          id={kitchenId}
          onClose={()=> this.setState({isOpenEditKitchen: false})}
          onAfterSubmit={()=> this.setState({isOpenEditKitchen: false})}
          uiSchema={uiSchema}
        />
        <OldDevicesPreviewModal
          isOpen={isOpenOldDeviceLayout}
          onClose={()=> this.setState({isOpenOldDeviceLayout: false})}
        />
        <DevicesPreviewModal
          isOpen={isOpenDeviceLayout}
          onClose={()=> this.setState({isOpenDeviceLayout: false})}
        />
      </View>
    );
  }

  renderRow = (index) => (
    <View key={index} style={[styles.rowFlex, {flex: 1}]}>
      {[...Array(15).keys()].map(this.renderCell)}
    </View>
  );

  render() {
    const { width, height } = this.props;
    if (width < 1 || height < 1) {
      return <></>;
    } else {
      return this.renderGrid(width, height);
    }
  }
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: Theme.light,
    display: 'flex',
    flexDirection: 'column',
  },
  dragItem: {
    zIndex: 100
  },
  border: {
    borderRadius: 4,
    borderWidth: 0,
  },
  borderInner: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e1e1e1',
    borderStyle: 'dashed'
  },
  inner: {
    backgroundColor: Theme.pGreen
  },
  rowFlex: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  columnFlex: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
});

const optionsStyles = {
  optionsContainer: {
    marginTop: 30,
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

const triggerStyles = {
  triggerText: {
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 15,
    paddingRight: 15,
  },
  triggerOuterWrapper: {
    margin: 2,
    borderRadius: 4,
    backgroundColor: Theme.pBlue,
    flex: 1,
  },
  triggerWrapper: {
    borderRadius: 4,
    backgroundColor: Theme.pBlue,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  triggerTouchable: {
    // underlayColor: 'darkblue',
    activeOpacity: 70,
    style : {
      flex: 1,
    },
  },
};

export default GridView;
