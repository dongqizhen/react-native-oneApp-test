import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated','Debugger and device', 'Module RCTImageLoader']);
AppRegistry.registerComponent('oneAPP', () => App());
