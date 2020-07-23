import React from 'react'
import {
  Alert,
  NativeModules,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import DevicesLayoutContainer from '_src/containers/DevicesLayoutContainer';
import SignatureButton from '_src/components/SignatureButton';
import TaskHeader from '_src/components/TaskHeader';
import TextArea from '_src/components/TextArea';
import request from '_src/utils/request';
import Logger from '_src/logger';
const logger = new Logger('InstallTask');

class InstallTask extends React.Component {
  constructor(props) {
    super(props);
    const { task, loading } = props;
    const { organisation, admin_signature_url, reseller_signature_url, note_desc, resolved_desc, unresolved_desc } = task || {};
    this.state = {
      loading,
      task,
      organisation,
      adminSig: admin_signature_url,
      resellerSig: reseller_signature_url,
      noteDesc: note_desc,
      resolvedDesc: resolved_desc,
      unresolvedDesc: unresolved_desc
    }
  }

  handleSaveSig = (key, base64DataUrl) => {
    const { task } = this.props;
    const { id } = task || {};
    logger.info(`create signature of ${key} for task_id: ${id}, base64: ${base64DataUrl.toString().substring(0, 15)}`);
    if ((key === 'adminSig' || key === 'resellerSig') && base64DataUrl) {
      const attr  = key === 'adminSig' ? 'admin_signature' : 'reseller_signature';
      const body = {
        field_task_id: id,
        [attr]: base64DataUrl
      };
      logger.info(`create signature for ${key}`);
      request({
        path: `/api/v1/rpc/create_signature`,
        method: 'POST',
        body: JSON.stringify(body)
      }).then(() => {
        this.setState({[key]:  base64DataUrl});
      }).catch(e => Alert.alert(`签名无法保存: ${e.message}`));
    }
  }

  render() {
    const { adminSig, resellerSig, noteDesc, resolvedDesc, unresolvedDesc, organisation } = this.state;
    const { id } = this.state?.task;
    return (
      <View style={styles.pageContainer}>
        <View style={styles.layoutContainer}>
          <View style={[styles.columnFlex,styles.mRgt, {flex: 3}]}>
            <View style={[{flex: 9}]}>
              <DevicesLayoutContainer
                 id={id}
                 disabled={true}
                 category="install"
              />
            </View>
            <View style={[styles.rowFlex, styles.border, {flex: 1}]}>
              <SignatureButton
                text='(空)'
                label="设备负责人"
                uri={adminSig}
                onSave={(base64) => this.handleSaveSig('adminSig', base64)}
              />
              <SignatureButton
                text='(空)'
                label="代理商"
                uri={resellerSig}
                onSave={(base64) => this.handleSaveSig('resellerSig', base64)}
              />
            </View>
          </View>
          <View style={[styles.columnFlex, {flex: 1}]}>
            <View style={[styles.border, {flex: 1}]}>
              <TextArea
                id={id}
                prop="注意事项"
                name="note_desc"
                onChange={(text) => this.setState({noteDesc: text})}
                text={noteDesc}
              />
            </View>
            <View style={[styles.border, {flex: 1}]}>
              <TextArea
                id={id}
                prop="现场已完成事项"
                name="resolved_desc"
                onChange={(text) => this.setState({resolvedDesc: text})}
                text={resolvedDesc}
              />
            </View>
            <View style={[styles.border, {flex: 1}]}>
              <TextArea
                id={id}
                prop="现场未完成事项"
                name="unresolved_desc"
                onChange={(text) => this.setState({unresolvedDesc: text})}
                text={unresolvedDesc}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  pageContainer: {
    padding: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  titleContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
    marginBottom: 10
  },
  layoutContainer: {
    width: '100%',
    flex: 17,
    display: 'flex',
    flexDirection: 'row',
  },
  leftLayout: {
    flex: 3,
    marginRight: 10
  },
  rightLayout: {
    flex: 1
  }
});
export default InstallTask;
