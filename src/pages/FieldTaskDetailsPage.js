import React from 'react';
import { Alert, View, Text, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import AttributesTable from '_src/containers/AttributesTable';
import Table from '_src/components/Table';
import TableContainer from '_src/containers/TableContainer';
import Loading from '_src/components/Loading';
import request from '_src/utils/request';
import store from '_src/utils/store';
import formatDate from '_src/utils/formatDate';
import yesNo from '_src/utils/yesNo';
import relationshipToObject from '_src/utils/relationshipToObject';
import Logger from '_src/logger';
const logger = new Logger('FieldTaskDetailsPage');

const oldDeviceColumns = [
  {
    header: {
      label: '厨房'
    },
    flex: 3,
    render: (resource, included) => {
      const kitchen = relationshipToObject(resource, included, 'kitchen');
      return <Text style={styles.cell}>{kitchen?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '设备'
    },
    flex: 1,
    render: (resource, included) => {
      const dm = relationshipToObject(resource, included, 'device_model');
      return <Text style={styles.cell}>{dm?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '宽(mm)',
      attribute: 'width'
    },
    flex: 1,
    render: (resource) => {
      const width = resource?.attributes?.width;
      return width
        ? <Text style={styles.cell}>{width}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  },
  {
    header: {
      label: '长(mm)',
      attribute: 'length'
    },
    flex: 1,
    render: (resource) => {
      const length = resource?.attributes?.length;
      return length
        ? <Text style={styles.cell}>{length}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  },
  {
    header: {
      label: '高(mm)',
      attribute: 'height'
    },
    flex: 1,
    render: (resource) => {
      const height = resource?.attributes?.height;
      return height
        ? <Text style={styles.cell}>{height}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  },
  {
    header: {
      label: '能耗测试',
      attribute: 'measure_usage'
    },
    flex: 1,
    render: (resource, included) => {
      const attributes = resource?.attributes || {};
      const { measurement_id, measure_usage, measure_time } = attributes;
      const tested = measurement_id && measure_usage > 0 && measure_time > 0;
      return <Text style={tested ? styles.cell : styles.error}>{tested ? '已测试' : '未完成'}</Text>
    }
  }
];

const deviceColumns = [
  {
    header: {
      label: '厨房'
    },
    flex: 2,
    render: (resource, included) => {
      const kitchen = relationshipToObject(resource, included, 'kitchen');
      return <Text style={styles.cell}>{kitchen?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '产品名称'
    },
    flex: 1,
    render: (resource, included) => {
      const dm = relationshipToObject(resource, included, 'device_model');
      return <Text style={styles.cell}>{dm?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '设备型号'
    },
    flex: 2,
    render: (resource, included) => {
      const model = relationshipToObject(resource, included, 'device_secondary_model');
      return <Text style={styles.cell}>{model?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '状态',
      attribute: 'status_label'
    },
    flex: 1
  }
];

const repairRecordColumns = [
  {
    header: {
      label: '日期',
      attribute: 'created_at'
    },
    flex: 3,
    render: (resource) => <Text style={styles.cell}>{formatDate(resource.attributes.created_at)}</Text>
  },
  {
    header: {
      label: '设备'
    },
    flex: 1,
    render: (resource, included) => {
      const dm = relationshipToObject(resource, included, 'device_model');
      return <Text style={styles.cell}>{dm?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '配件',
      attribute: 'summary'
    },
    flex: 3
  },
  {
    header: {
      label: '备注',
      attribute: 'description'
    },
    flex: 3
  },
  {
    header: {
      label: '负责人',
      attribute: 'user'
    },
    flex: 1
  },
];

const kitchenColumns = [
  {
    header: {
      label: '厨房名字',
      attribute: 'name',
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{resource.name}</Text>
  },
  {
    header: {
      label: '有无电梯',
      attribute: 'has_lift',
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{yesNo(resource.has_lift)}</Text>
  },
  {
    header: {
      label: '楼层',
      attribute: 'level',
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{resource.level}</Text>
  },
  {
    header: {
      label: '最细处(宽mm)',
      attribute: 'min_width',
    },
    flex: 1,
    render: (resource) => {
      const minWidth = resource?.min_width;
      return minWidth
        ? <Text style={styles.cell}>{minWidth}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  },
  {
    header: {
      label: '最矮处(高mm)',
      attribute: 'min_height',
    },
    flex: 1,
    render: (resource) => {
      const minHeight = resource?.min_height;
      return minHeight
        ? <Text style={styles.cell}>{minHeight}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  },
  {
    header: {
      label: '最窄处(长mm)',
      attribute: 'min_length',
    },
    render: (resource) => {
      const minLength = resource?.min_length;
      return minLength
        ? <Text style={styles.cell}>{minLength}</Text>
        : <FontAwesomeIcon icon={ faExclamationCircle } style={styles.error} />
    }
  }
];

const kitchenwareColumns = [
  {
    header: {
      label: '厨房'
    },
    flex: 1,
    render: (resource, included) => {
      const kitchen = relationshipToObject(resource, included, 'kitchen');
      return <Text style={styles.cell}>{kitchen?.attributes?.name}</Text>
    }
  },
  {
    header: {
      label: '设备'
    },
    flex: 1,
    render: (resource, included) => {
      const name = resource.attributes.name;
      return <Text style={styles.cell}>{name}</Text>
    }
  },
  {
    header: {
      label: '原有数量',
      attribute: 'number',
    },
    flex: 1,
  },
  {
    header: {
      label: '是否可替换',
    },
    flex: 1,
    render: (resource) => <Text style={styles.cell}>{yesNo(resource.attributes.replaceable)}</Text>
  },
];

const fieldTaskUiSchema = [
  {
    label: '任务类型',
    name: 'category_label',
    widget: 'input'
  },
  {
    label: '任务状态',
    name: 'status_label',
    widget: 'input'
  },
  {
    label: '酒店名字',
    name: 'organisation_name',
    widget: 'input'
  },
  {
    label: '酒店地址',
    name: 'organisation.full_address',
    widget: 'input'
  },
  {
    label: '联系人',
    name: 'contact',
    widget: 'input'
  },
  {
    label: '开始里程',
    name: 'start_mileage',
    widget: 'input'
  },
  {
    label: '结束里程',
    name: 'end_mileage',
    widget: 'input'
  },
  {
    label: '注意事项',
    name: 'note_desc',
    type: 'text',
    widget: 'input'
  },
  {
    label: '已解决事项',
    name: 'resolved_desc',
    type: 'text',
    widget: 'input'
  },
  {
    label: '未解决事项',
    name: 'unresolved_desc',
    type: 'text',
    widget: 'input'
  },
];


function GeneratedScrollView({children}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom:20}}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

class FieldTaskDetailsPage extends React.Component {
  state = {
    index: 0,
    loading: true,
    task: {}
  }

  async componentDidMount() {
    request({
      path: '/api/v1/rpc/current_task',
      method: 'GET'
    }).then(({ data }) => {
      this.setState({
        loading: false,
        task: data
      });
    }).catch(error => {
      logger.error(error);
      Alert.alert('错误', '服务器错误');
      this.setState({ loading: false });
    });
  }

  getUiSchema() {
    return ([
      {
        label: '邮箱',
        name: 'email',
        labelInfo: 'required',
        widget: 'input'
      },
      {
        label: '名字',
        name: 'name',
        widget: 'input'
      },
      {
        label: '类型',
        name: 'role',
        readonly: true,
        widget: 'input'
      }
    ]);
  }

  renderTabs = () => {
    const { task } = this.state;
    const kitchens = task?.kitchens;
    const category = task.category;
    const tabs = [
      {
        title: '当前任务',
        render: () => (
          <View style={style} key={1}>
            <GeneratedScrollView>
              <AttributesTable
                title="任务详情"
                uiSchema={fieldTaskUiSchema}
                attributes={task}
              />
            </GeneratedScrollView>
          </View>
        )
      },
      {
        title: '厨房列表',
        render: () => (
          <View style={style} key={2}>
            <View style={styles.container}>
              <Table
                list={kitchens || []}
                columns={kitchenColumns}
              />
            </View>
          </View>
        )
      },
      ...category === 'checkout' && [{
        title: '原厨具记录',
        render: () => (
          <View style={style} key={3}>
            <View style={styles.container}>
              <TableContainer
                collectionPath={`/api/v1/kitchenwares?filter[client_id]=${task.client_id || ''}&include=kitchen&sort=-device_model_id`}
                columns={kitchenwareColumns}
              />
            </View>
          </View>
        )
      }, {
        title: '已添加原厨具',
        render: () => (
          <View style={style} key={4}>
            <View style={styles.container}>
              <TableContainer
                collectionPath={`/api/v1/old_devices?filter[field_task_id]=${task.id}&include=kitchen,device_model`}
                columns={oldDeviceColumns}
              />
            </View>
          </View>
        )
      }] || [],
      ...category === 'install' && [{
        title: '已添加合隆厨具',
        render: () => (
          <View style={style} key={5}>
            <View style={styles.container}>
              <TableContainer
                collectionPath={`/api/v1/devices?filter[field_task_id]=${task.id}&include=kitchen,device_model,device_secondary_model`}
                columns={deviceColumns}
              />
            </View>
          </View>
        )
      }] || [],
      ...category === 'aftersale' && [{
        title: '盘点设备',
        render: () => (
          <View style={style} key={6}>
            <View style={styles.container}>
              <TableContainer
                collectionPath={`/api/v1/devices?filter[scan_task_id]=${task.id}&include=kitchen,device_model`}
                columns={deviceColumns}
              />
            </View>
          </View>
        )
      }] || []
    ];
    const tabHeaders = tabs.map( ({ title }) => ({ title }));
    return (
      <Tabs tabs={tabHeaders}>
        {tabs.map(t => t.render())}
      </Tabs>
    );
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return  <Loading />;
    }
    return this.renderTabs();
  }
}

const style = {
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
  backgroundColor: 'white',
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 20,
    padding: 20,
  },
  scrollView: {
    width: '100%'
  },
  text: {
    fontSize: 42,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    padding: 5
  },
  error: {
    margin: 5,
    color: 'red'
  }
});

export default FieldTaskDetailsPage;
