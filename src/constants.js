// const API_ORIGIN = 'http://161.189.138.68:12345'; // aws, TODO: to be removed;
// const API_ORIGIN = 'http://121.196.31.151'; // aliyun
const API_ORIGIN = "http://10.0.2.2:3000"; // emulator local host

const Theme = {
  pGreen: '#7fb84f',
  pBlue: '#00b2ec',
  textColor: 'black',
  light: '#f1f1f1',
  medium: '#c1c1c1',
  dark: '#a1a1a1',
}

const TentyConfig = {
  handshakePath: '/api/v1/boxes/handshake',
  heartbeatIntervel: 60,
  mqttHost: '',
  mqttPort: 1883,
  mqttUser: '',
  mqttPassword: ''
}

export {
  API_ORIGIN,
  Theme,
  TentyConfig
}
