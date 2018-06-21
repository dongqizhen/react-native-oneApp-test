/**
 * Created by lipeiwei on 16/9/30.
 */

import React from 'react';
import {
  StyleSheet,
 
  Text,
  View,
  StatusBar,
  BackHandler,
  Platform
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components'
import {getRouteMap, registerNavigator} from './app/route';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './app/reducers';
import MusicControlModal from './app/component/musicControlModal';
import Toast from './app/util/toast';
import Orientation from './app/util/orientation';
//import * as Wechat from 'react-native-wechat';
/* import { autobind } from 'core-decorators';
console.log(autobind) */

console.log(Orientation)

let lastClickTime = 0;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigator: {
    flex: 1,
    backgroundColor: 'white'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  }

});

//@autobind

class App extends React.Component {

  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
  }

  componentWillMount() {
    Orientation.lockToPortrait();
    if (Platform.OS === 'android') {
     // Orientation.registerOnOrientationChanged();
     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentDidMount (){
    //想要使用微信分享, 你必须到微信分享平台 https://open.weixin.qq.com/ 申请appid
   // Wechat.registerApp('your wechat appid');
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  render() {
    
    return (
      <View style={styles.container}> 
        <MusicControlModal/>  
        <StatusBar
            backgroundColor="black"
            barStyle="default"
        />
        <Navigator
            style={styles.navigator}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
            initialRoute={{
              name: 'MainContainer',//MainContainer
        }}/>
      </View>
    );
  }

  //出场动画
  configureScene(route) {
    let sceneAnimation = getRouteMap().get(route.name).sceneAnimation;
    if (sceneAnimation) {
      return sceneAnimation;
    }
    //默认
    return Navigator.SceneConfigs.PushFromRight
  }

  renderScene(route, navigator) {
    console.log(route)
    this.navigator = navigator;
    registerNavigator(navigator);
    //Each component name should start with an uppercase letter
    //jsx中的组件都得是大写字母开头, 否则将报错, expected a component class, got [object Object]
    let Component = getRouteMap().get(route.name).component;
    if (!Component) {
      return (
        <View style={styles.errorView}>
          <Text style={styles.errorText}>您所启动的Component未在routeMap中注册</Text>
        </View>
      );
    }
    return (
      <Component {...route}/>
    );
  }

  onBackAndroid() {
    const routers = this.navigator.getCurrentRoutes();
    if (routers.length > 1) {
      this.navigator.pop();
      return true;
    }
    let now = new Date().getTime();
    if (now - lastClickTime < 2500) {//2.5秒内点击后退键两次推出应用程序
      return false;//控制权交给原生
    }
    lastClickTime = now;
    Toast.show('再按一次退出');
    return true;
  }
}

//export default App;
export default function globalInit() {
  var loggerMiddleware = createLogger();
  var store = applyMiddleware(thunk, loggerMiddleware)(createStore)(reducers);
  return () => {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  };
};





