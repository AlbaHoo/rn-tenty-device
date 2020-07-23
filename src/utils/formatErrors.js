interface Error {
  title: string,
  detail: string,
  source?: { pointer: string }
}

function fieldMapper(key: string) {
  const components = key.split('/');
  const field = components.pop();
  const mapper = {
    admin_signature: '酒店负责人',
    base: '附',
    client: '方案',
    close_reason: '关闭原因',
    device_secondary_model_id: '型号ID',
    end_mileage: '结束里程',
    measure_usage: '测试能耗',
    measure_time: '测试时间',
    reseller_signature: '代理商',
    organisation: '酒店',
    organisation_id: '酒店',
    user: '维修用户',
    user_id: '维修用户',
  };
  return mapper[field] || field;
}

export default function formatErrors(errors: Error[]) {
  const errorMessages = errors.map(error => {
    const source = error?.source?.pointer || '';
    const prefix = fieldMapper(source);
    if (prefix) {
      return `${prefix}: ${error.detail}`;
    } else {
      return error.detail;
    }
  });
  return errorMessages.join("; \n");
}
