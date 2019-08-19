import Taro, { Component, Config } from '@tarojs/taro';
import Index from './pages/home/index';
import '@tarojs/async-await';
import './assets/style/icon.less';
import './app.less'
import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/home/index',
      'pages/like/index',
      'pages/login/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    tabBar: {
      list: [
        {
          pagePath: "pages/home/index",
          text: "",
          iconPath: "./assets/images/tabbar-icon/home.png",
          selectedIconPath: "./assets/images/tabbar-icon/home-active.png"
        },
        {
          pagePath: "pages/like/index",
          text: "",
          iconPath: "./assets/images/tabbar-icon/user.png",
          selectedIconPath: "./assets/images/tabbar-icon/user-active.png"
        },
      ]
    },
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
