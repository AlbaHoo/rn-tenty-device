import React from 'react';
import { Text } from 'react-native';
import AttributeFormContainer from '_src/containers/AttributeFormContainer';
import store from '_src/utils/store';

class UserDetailsPage extends React.Component {
  state = {
    userId: ''
  }

  async componentDidMount() {
    const userId = await store.getUserId();
    this.setState({userId});
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

  render() {
    const { userId } = this.state;
    const getPath = `/api/v1/users/${userId}`;
    if (!userId) {
      return <></>;
    }
    return (
      <AttributeFormContainer
        resource="user"
        getPath={getPath}
        uiSchema={this.getUiSchema()}
      />
    );
  }
}
export default UserDetailsPage;
