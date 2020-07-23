const getDeviceIcons = () => {
  return [
    { name: 'aizai1', shape: 1, label: '矮仔炉' },
    { name: 'aizai2', shape: 2, label: '双头矮仔炉'},
    { name: 'chao1', shape: 1, label: '炒炉' },
    { name: 'chao2', shape: 2, label: '双头炒炉' },
    { name: 'chao3', shape: 1, label: '大炒炉' },
    { name: 'zhenggui', shape: 1, label: '蒸柜' },
    { name: 'zhenglu', shape: 1, label: '蒸炉' },
    // { name: 'changfenlu', shape: 1, label: '肠粉炉' }
    { name: 'pintai', shape: 1, label: '拼台' }
  ];
}

const name2label = {
  aizai1: '矮仔炉',
  aizai2: '双头矮仔炉',
  chao1: '炒炉',
  chao2: '双头炒炉',
  chao3: '大炒炉',
  zhenggui: '蒸柜',
  zhenglu: '蒸炉',
  pintai: '拼台'
};

const getDeviceInfo = (name, vertical) => {
  const oneTileDevices = ['aizai1', 'chao1', 'chao3', 'zhenggui', 'zhenglu', 'pintai'];
  const twoTileDevices = ['aizai2', 'chao2'];
  const label = name2label[name];
  if (oneTileDevices.includes(name)) {
    return { name, wf: 1, hf: 1, label };
  } else if (twoTileDevices.includes(name)) {
    const wf = vertical ? 1 : 2;
    const hf = vertical ? 2 : 1;
    return { name, vertical, wf, hf, label };
  } else {
    console.error(`unknow device name: ${name}`);
    // return { name: ''}
    return { name: 'aizai2', wf: 2, hf: 1, label };
  }
}

const hasConflict = (devices) => {
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


export default {
  getDeviceIcons,
  getDeviceInfo,
  hasConflict
}
