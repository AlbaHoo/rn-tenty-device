import * as React from 'react';
import { SvgCss } from 'react-native-svg';

const aizai1 = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs>
<style>
  .cls-1 {fill:#fff;}
  .cls-1,.cls-2 {
    stroke: ${color || '#000'};
    stroke-miterlimit:10;
  }
  .cls-2{fill:none;}
</style>
</defs><title>单头矮仔炉</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><line class="cls-2" x1="0.5" y1="45.85" x2="45.85" y2="0.5"/><line class="cls-2" x1="0.5" y1="0.5" x2="45.85" y2="45.85"/><circle class="cls-2" cx="23.18" cy="23.18" r="9.47"/></g></g></svg>
`;
const chao1 = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1{fill:#fff;stroke:${color || '#213815'};stroke-miterlimit:10;}</style></defs><title>单炒炉</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><circle class="cls-1" cx="23.18" cy="22.17" r="13.5"/><circle class="cls-1" cx="23.18" cy="23.51" r="10.18"/></g></g></svg>
`;

const zhenglu = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1{fill:#fff;}.cls-1,.cls-2{stroke:${color || '#213815'};stroke-miterlimit:10;}.cls-2{fill:none;}</style></defs><title>蒸炉</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><circle class="cls-2" cx="11.48" cy="23.44" r="9.47"/><circle class="cls-2" cx="11.48" cy="17.62" r="2.13"/><circle class="cls-2" cx="12.35" cy="29" r="2.13"/><circle class="cls-2" cx="11.48" cy="23.44" r="2.13"/><circle class="cls-2" cx="5.33" cy="23.31" r="2.13"/><circle class="cls-2" cx="17.23" cy="23.44" r="2.13"/><circle class="cls-2" cx="34.82" cy="23.31" r="9.47"/><circle class="cls-2" cx="34.82" cy="17.49" r="2.13"/><circle class="cls-2" cx="33.94" cy="28.87" r="2.13"/><circle class="cls-2" cx="34.82" cy="23.31" r="2.13"/><circle class="cls-2" cx="40.97" cy="23.18" r="2.13"/><circle class="cls-2" cx="29.06" cy="23.31" r="2.13"/></g></g></svg>
`;

const chao3 = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1,.cls-2{fill:#fff;stroke: ${color || '#000'};stroke-miterlimit:10;}.cls-2{stroke-width:2px;}</style></defs><title>chao3</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><circle class="cls-2" cx="23.18" cy="23.18" r="19.84"/></g></g></svg>
`;
const aizai2 = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91.71 46.35"><defs><style>.cls-1{fill:#fff;}.cls-1,.cls-2{stroke:${color || '#213815'};stroke-miterlimit:10;}.cls-2{fill:none;}</style></defs><title>双头矮仔炉</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="90.71" height="45.35"/><line class="cls-2" x1="45.85" y1="45.85" x2="45.85" y2="0.5"/><line class="cls-2" x1="45.85" y1="45.85" x2="91.21" y2="0.5"/><line class="cls-2" x1="0.5" y1="45.85" x2="45.85" y2="0.5"/><line class="cls-2" x1="45.85" y1="0.5" x2="91.21" y2="45.85"/><line class="cls-2" x1="0.5" y1="0.5" x2="45.85" y2="45.85"/><circle class="cls-2" cx="23.18" cy="23.18" r="9.47"/><circle class="cls-2" cx="68.53" cy="23.18" r="9.47"/></g></g></svg>
`;

const aizai2_rotate = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 91.71"><defs><style>.cls-1{fill:#fff;}.cls-1,.cls-2{stroke: ${color || '#000'};stroke-miterlimit:10;}.cls-2{fill:none;}</style></defs><title>双头矮仔炉(v)</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="-22.18" y="23.18" width="90.71" height="45.35" transform="translate(-22.68 69.03) rotate(-90)"/><line class="cls-2" x1="45.85" y1="45.85" x2="0.5" y2="45.85"/><line class="cls-2" x1="45.85" y1="45.85" x2="0.5" y2="0.5"/><line class="cls-2" x1="45.85" y1="91.21" x2="0.5" y2="45.85"/><line class="cls-2" x1="0.5" y1="45.85" x2="45.85" y2="0.5"/><line class="cls-2" x1="0.5" y1="91.21" x2="45.85" y2="45.85"/><circle class="cls-2" cx="23.19" cy="68.54" r="9.47"/><circle class="cls-2" cx="23.19" cy="23.17" r="9.47"/></g></g></svg>
`;

const chao2 = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 91.71 46.35"><defs><style>.cls-1{fill:#fff;stroke: ${color || '#000'};stroke-miterlimit:10;}</style></defs><title>双炒炉</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="90.71" height="45.35"/><circle class="cls-1" cx="22.01" cy="23.41" r="13.5"/><circle class="cls-1" cx="22.01" cy="25.51" r="10.18"/><circle class="cls-1" cx="69.96" cy="23.18" r="13.5"/><circle class="cls-1" cx="69.96" cy="25.28" r="10.18"/></g></g></svg>
`;

const chao2_rotate = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 91.71"><defs><style>.cls-1{fill:#fff;stroke: ${color || '#000'};stroke-miterlimit:10;}</style></defs><title>双炒炉(v)</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="-22.18" y="23.18" width="90.71" height="45.35" transform="translate(-22.68 69.03) rotate(-90)"/><circle class="cls-1" cx="23.41" cy="69.7" r="13.5"/><circle class="cls-1" cx="25.51" cy="69.7" r="10.18"/><circle class="cls-1" cx="23.18" cy="21.74" r="13.5"/><circle class="cls-1" cx="25.28" cy="21.74" r="10.18"/></g></g></svg>
`;
const zhenggui = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1{fill:#fff;}.cls-1,.cls-2{stroke:${color || '#000'};stroke-miterlimit:10;}.cls-2{fill:none;}</style></defs><title>zhenggui</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><line class="cls-2" x1="45.85" y1="45.85" x2="0.5" y2="0.5"/></g></g></svg>
`;

const changfenlu = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1,.cls-2{fill:#fff;stroke:${color || '#000'};stroke-miterlimit:10;}.cls-2{stroke-width:1.5px;}</style></defs><title>changfenlu</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><rect class="cls-2" x="6.17" y="17.53" width="14.17" height="22.68"/><rect class="cls-2" x="27.08" y="17.53" width="14.17" height="22.68"/></g></g></svg>
`;

const pintai = (color) => `
<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.35 46.35"><defs><style>.cls-1{fill:#fff;}.cls-1,.cls-2{stroke:${color || '#000'};stroke-miterlimit:10;}.cls-2{fill:none;}</style></defs><title>pintai</title><g id="图层_2" data-name="图层 2"><g id="图层_1-2" data-name="图层 1"><rect class="cls-1" x="0.5" y="0.5" width="45.35" height="45.35"/><line class="cls-2" x1="45.85" y1="0.5" x2="0.5" y2="45.85"/><line class="cls-2" x1="12.43" y1="45.85" x2="45.85" y2="12.43"/><line class="cls-2" x1="22.96" y1="45.93" x2="45.71" y2="23.18"/><line class="cls-2" x1="34.05" y1="45.85" x2="45.73" y2="34.17"/><line class="cls-2" x1="33.92" y1="0.5" x2="0.5" y2="33.92"/><line class="cls-2" x1="23.18" y1="0.64" x2="0.42" y2="23.4"/><line class="cls-2" x1="12.18" y1="0.5" x2="0.5" y2="12.18"/></g></g></svg>
`;

const getXml = (name, color) => {
  switch(name) {
    case 'aizai1':
    case 'aizai1_rotate':
      return aizai1(color);
    case 'chao1':
    case 'chao1_rotate':
      return chao1(color);
    case 'zhenglu':
    case 'zhenglu_rotate':
      return zhenglu(color);
    case 'chao3':
    case 'chao3_rotate':
      return chao3(color);
    case 'zhenggui':
    case 'zhenggui_rotate':
      return zhenggui(color);
    case 'changfenlu':
    case 'changfenlu_rotate':
      return changfenlu(color);

    case 'aizai2': return aizai2(color);
    case 'aizai2_rotate': return aizai2_rotate(color);
    case 'chao2': return chao2(color);
    case 'chao2_rotate': return chao2_rotate(color);
    case 'pintai': return pintai(color);
    default: return aizai1(color);
  }
}

const DeviceSvg = ({name, vertical, color, width, height}) => {
  return (
    <SvgCss
      xml={getXml(`${name}${vertical ? '_rotate' : ''}`, color)}
      width={width || '100%'}
      height={height || '100%'}
    />
  )
}

export default DeviceSvg;
