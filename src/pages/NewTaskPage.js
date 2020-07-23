import React from 'react';
import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AttributeFormContainer from '_src/containers/AttributeFormContainer';
import ResourceSelector from '_src/containers/ResourceSelector';
import GeoSelector from '_src/containers/GeoSelector';
import store from '_src/utils/store';
import formatDate from '_src/utils/formatDate';

class NewTaskPage extends React.Component {
  state = {
    userId: '',
    province: '',
    city: '',
    county: '',
    organisation: null
  }

  async componentDidMount() {
    const userId = await store.getUserId();
    this.setState({userId});
  }

  getUiSchema() {
    return ([
      {
        label: '省',
        name: 'state',
        widget: ({ onChange, value, editable }) => (
          <GeoSelector
            editable={editable}
            onChange={(v) => this.setState({province: v, city: '', county: ''})}
            title="省"
            root="provinces"
            placeholder="-- 全部省 --"
            remotePath="geolocation/provinces"
            selectedValue={value}
          />
        ),
      },
      {
        label: '市',
        name: 'city',
        widget: ({ onChange, value, editable }) => {
          const { province } = this.state;

          return (
            <GeoSelector
              key={province}
              editable={!!province}
              onChange={(v) => this.setState({city: v, county: ''})}
              title="市"
              root="cities"
              placeholder="-- 全部市 --"
              remotePath={province ? `geolocation/cities?province=${province}` : ''}
              selectedValue={value}
            />
          );
        },
      },
      {
        label: '区',
        name: 'county',
        widget: ({ onChange, value, editable }) => {
          const { province, city } = this.state;

          return (
            <GeoSelector
              key={`${province}-${city}`}
              editable={!!city}
              onChange={(v) => this.setState({county: v})}
              title="市"
              root="counties"
              placeholder="-- 全部区 --"
              remotePath={province && city ? `geolocation/counties?province=${province}&city=${city}` : ''}
              selectedValue={value}
            />
          );
        },
      },
      {
        label: '酒店',
        name: 'organisation_id',
        widget: ({ onChange, value, editable }) => {
          const { province, city, county } = this.state;
          const filters = { province, city, county };
          const params = Object.keys(filters).filter(e => filters[e]).map(e=>`filter[${e}]=${filters[e]}`).join('&');
          return (
            <ResourceSelector
              key={`${province}-${city}-${county}`}
              editable={editable}
              onChange={(v) => this.setState({organisation_id: v}, () => onChange(v))}
              title="酒店"
              placeholder="-- 选择酒店 --"
              remotePath={`organisations?${params}`}
              selectedValue={value}
            />
          );
        }
      },
      {
        label: '方案',
        name: 'client_id',
        widget: ({ onChange, value, editable }) => {
          const { organisation_id } = this.state;
          const params = `filter[organisation_id]=${organisation_id}`;
          return (
            <ResourceSelector
              key={organisation_id}
              editable={editable && !!organisation_id}
              onChange={onChange}
              labelKey="code"
              title="方案"
              placeholder="-- 选择方案 --"
              remotePath={organisation_id ? `clients?${params}` : ''}
              selectedValue={value}
            />
          );
        }
      },
      {
        label: '开始里程',
        name: 'start_mileage',
        widget: 'input',
        type: 'number'
      },
      {
        label: '任务指派',
        name: 'user_id',
        widget: 'select',
        initialValue: this.state.userId,
        readonly: true,
        options: [
          {
            label: '我自己',
            value: this.state.userId
          }
        ]
      },
      {
        label: '任务类型',
        name: 'category',
        widget: 'select',
        initialValue: 'aftersale',
        readonly: true,
        options: [
          {
            label: '维保任务',
            value: 'aftersale'
          }
        ]
      }
    ]);
  }

  render() {
    const { userId } = this.state;
    if (!userId) {
      return <></>;
    }
    return (
      <AttributeFormContainer
        title="维保任务信息"
        editMode={true}
        resource="field_task"
        mutatePath="/api/v1/field_tasks"
        mutateMethod="POST"
        onClose={() => Actions.pop() }
        uiSchema={this.getUiSchema()}
        onAfterSubmit={() => Actions.tasks({ type: 'replace' })}
        extraAttributes={{
          status: 'accepted',
          user_id: userId,
          category: 'aftersale',
          source: 'mobile'
        }}
      />
    );
  }
}
export default NewTaskPage;
