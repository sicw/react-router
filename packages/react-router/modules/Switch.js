import React, { PropTypes } from 'react'
import matchPath from './matchPath'

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  static contextTypes = {
    router: PropTypes.shape({
      listen: PropTypes.func.isRequired
    }).isRequired
  }

  static propTypes = {
    children: PropTypes.node
  }

  state = {
    location: null
  }

  componentWillMount() {
    // 全局的history
    const { router } = this.context

    this.setState({ 
      location: router.location
    })

    // Start listening here so we can <Redirect> on the initial render.
    // 开始监听变化(history.push forward等), 有变化时更新state
    this.unlisten = router.listen(() => {
      this.setState({
        location: router.location
      })
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { children } = this.props
    // 当前选中的标签
    const { location } = this.state
    // 获取<Switch>下所有的标签
    const routes = React.Children.toArray(children)

    let route, match
    // 这里判断了match == null 只有有一个满足 match就不是空 循环终止
    for (let i = 0, length = routes.length; match == null && i < length; ++i) {
      route = routes[i]
      match = matchPath(location.pathname, route.props.path, route.props)
    }

    // 返回了一个新的Element
    return match ? React.cloneElement(route, { computedMatch: match }) : null
  }
}

export default Switch
