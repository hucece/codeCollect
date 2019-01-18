import React, { PureComponent } from 'react';
import { Tooltip, Icon } from 'antd';
import styles from './index.less';

export default class ImageGalley extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imgOriginWidth: 0, // 图片原始宽度
      imgOriginHeight: 0, // 图片原始高度
      curImgWidth: 0, // 图片现宽度
      curImgHeight: 0, // 图片现高度
      viewerWidth: 0, // 视图窗口宽度
      viewerHeight: 0, // 视图窗口高度
      initImgScale: 1, // 自适应（同样在图片初现时)的图片缩放比
      imgScale: 1, // 图片缩放比
      imgStyle: {}, // 图片的样式
      enableZoomIn: true, // 是否可以缩小
      enableZoomout: true, // 是否可放大
      enableOriginScale: true, // 是否可实际大小
      enableFixedScale: false, // 是否可自适应
      enableHorizontalScroll: false, // 是否可水平拖动
      enableVerticalScroll: false, // 是否可垂直拖动
    };
  }
  componentDidMount() {
    // 监听windowze的resize事件，调整图片
    window.onresize = () => {
      this.resize();
    };
    window.onkeydown = (e) => {
      if (e.keyCode !== 27) return;
      this.handleCloseClick();
    };
  }
  componentWillUnmount() {
    // 取消监听
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
    window.onresize = null;
    window.onkeydown = null;
  }
  // 获取图片原始尺寸
  getImgOriginSize = (img) => {
    const imgSize = {
      imgOriginWidth: img.naturalWidth,
      imgOriginHeight: img.naturalHeight,
    };
    this.setState({ ...imgSize });
    return imgSize;
  }
  // 获取视窗大小
  getViewerSize = () => {
    const viewerSize = {
      viewerWidth: this.imgContainer.offsetWidth,
      viewerHeight: this.imgContainer.offsetHeight,
    };
    this.setState({ ...viewerSize });
    return viewerSize;
  }
  // 设置图片样式
  setImgStyle = ({ curImgWidth, curImgHeight, viewerWidth, viewerHeight }) => {
    const left = (viewerWidth - curImgWidth) / 2;
    const top = (viewerHeight - curImgHeight) / 2;
    const imgStyle = {
      position: 'absolute',
      width: `${curImgWidth}px`,
      height: `${curImgHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
      cursor: left < 0 || top < 0 ? 'move' : 'pointer',
    };
    this.setState({
      imgStyle,
      enableHorizontalScroll: left < 0,
      enableVerticalScroll: top < 0,
    });
  }
  // 获取图片缩放
  getImgScale = (flag) => {
    const { imgScale } = this.state;
    const { zoomList } = this;
    const len = zoomList.length;
    let curZoom;
    switch (flag) {
      case 0: {
        for (let i = 0; i < len; i++) {
          const zoom = zoomList[i];
          if ((imgScale === zoom && i === len - 1) || imgScale < zoom) {
            curZoom = zoom;
            break;
          }
        }
        break;
      }
      case 1: {
        for (let j = len - 1; j >= 0; j--) {
          const zoom = zoomList[j];
          if ((imgScale === zoom && j === 0) || (imgScale > zoom)) {
            curZoom = zoom;
            break;
          }
        }
        break;
      }
      case 2: {
        // 实际大小
        curZoom = 1;
        break;
      }
      case 3: {
        // 适应页面
        curZoom = this.state.initImgScale;
        break;
      }
      default:
        break;
    }
    this.setState({
      enableZoomIn: curZoom !== zoomList[0],
      enableZoomout: curZoom !== zoomList[len - 1],
      enableOriginScale: curZoom !== 1,
      enableFixedScale: curZoom !== this.state.initImgScale,
      imgScale: curZoom,
    });
    return curZoom;
  }
  getPosition = (node) => {
    let left = node.offsetLeft;
    let top = node.offsetTop;
    let current = node.offsetParent; // 取得元素的offsetParent
    // 一直循环直到根元素
    while (current != null) {
      left += current.offsetLeft;
      top += current.offsetTop;
      current = current.offsetParent;
    }
    return { left, top };
  }
  initImgScale = ({ imgOriginWidth, imgOriginHeight, viewerWidth, viewerHeight }) => {
    const hoziralPadding = viewerWidth / 20;
    let curImgHeight = 0;
    let curImgWidth = 0;
    let imgScale = 1;
    let enableOriginScale = true;
    if (imgOriginWidth < viewerWidth && imgOriginHeight < viewerHeight) {
      curImgWidth = viewerWidth - (hoziralPadding * 2);
      if (curImgWidth > imgOriginWidth) {
        curImgWidth = imgOriginWidth;
      } else {
        imgScale = curImgWidth / imgOriginWidth;
      }
      curImgHeight = imgOriginHeight * imgScale;
    } else if (imgOriginWidth / viewerWidth > imgOriginHeight / viewerHeight) {
      curImgWidth = viewerWidth - (hoziralPadding * 2);
      imgScale = curImgWidth / imgOriginWidth;
      curImgHeight = imgOriginHeight * imgScale;
    } else {
      const verticalHeight = viewerHeight / 20;
      curImgHeight = viewerHeight - (verticalHeight * 2);
      imgScale = curImgHeight / imgOriginHeight;
      curImgWidth = imgScale * imgOriginWidth;
    }
    if (imgScale === 1) {
      enableOriginScale = false;
    }
    this.setState({
      imgScale,
      curImgHeight,
      curImgWidth,
      enableOriginScale,
      enableFixedScale: false,
      initImgScale: imgScale,
    });
    return { curImgHeight, curImgWidth, viewerWidth, viewerHeight };
  }
  resize = (imgScale) => {
    let curImgSize = {};
    if (imgScale) {
      const { viewerWidth, viewerHeight, imgOriginWidth, imgOriginHeight } = this.state;
      const curImgWidth = imgOriginWidth * imgScale;
      const curImgHeight = imgOriginHeight * imgScale;
      curImgSize = { viewerWidth, viewerHeight, curImgWidth, curImgHeight };
    } else {
      const viewSize = this.getViewerSize();
      const imgSize = this.getImgOriginSize(this.props.currentImg);
      curImgSize = this.initImgScale({ ...viewSize, ...imgSize });
    }
    this.setImgStyle(curImgSize);
  }
  imgLoaded = () => {
    this.resize();
  }
  tools = [
    { title: '放大', icon: 'plus', key: 0, enable: 'enableZoomout' },
    { title: '缩小', icon: 'minus', key: 1, enable: 'enableZoomIn' },
    { title: '实际大小', icon: 'appstore-o', key: 2, enable: 'enableOriginScale' },
    { title: '适应页面', icon: 'scan', key: 3, enable: 'enableFixedScale' },
    { title: '退出相册', icon: 'logout', key: 4 },
  ]
  zoomList = [0.1, 0.25, 0.33, 0.5, 0.65, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4]
  handleThumbClick = (img) => {
    this.props.handleThumbClick(img);
  }
  handleCloseClick = () => {
    this.props.toggleGalleyShow();
  }
  handleImgClick = (e) => {
    e.stopPropagation();
  }
  handleZoom = (flag) => {
    const imgScale = this.getImgScale(flag);
    this.resize(imgScale);
  }
  handleImgMouse = (e) => {
    const img = e.target;
    const { enableHorizontalScroll, enableVerticalScroll } = this.state;
    if (!img || (!enableHorizontalScroll && !enableVerticalScroll)) return;

    const position = this.getPosition(img);
    let move = true;
    const disX = e.clientX - position.left;
    const disY = e.clientY - position.top;

    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault();
      if (!move) return;

      const { imgContainer } = this;
      let newStyle = this.state.imgStyle;
      let { left, top } = newStyle;
      const pPosition = this.getPosition(imgContainer);

      const getLeft = () => {
        return Math.min(
          Math.max(
            imgContainer.offsetWidth - img.width - 10, moveEvent.clientX - disX - pPosition.left
          ), 10
        );
      };
      const getTop = () => {
        return Math.min(
          Math.max(
            imgContainer.offsetHeight - img.height - 10, moveEvent.clientY - disY - pPosition.top
          ), 10
        );
      };
      if (enableHorizontalScroll && enableVerticalScroll) {
        left = `${getLeft()}px`;
        top = `${getTop()}px`;
      } else if (enableHorizontalScroll) {
        left = `${getLeft()}px`;
      } else if (enableVerticalScroll) {
        top = `${getTop()}px`;
      }
      newStyle = {
        ...newStyle,
        left,
        top,
      };
      this.setState({ imgStyle: newStyle });
    };

    document.onmouseup = () => {
      move = false;
    };
  }
  render() {
    const { currentImg, imgList, activeImgIndex } = this.props;
    const toolbarIndex = `${activeImgIndex + 1} / ${imgList.length}`;
    return (
      <div className={styles.ImageGalley}>
        <div
          className={styles.imageBox}
          ref={(ref) => { this.imgContainer = ref; }}
          onClick={this.handleCloseClick}
        >
          <img
            src={currentImg.src}
            alt=""
            onLoad={this.imgLoaded}
            style={this.state.imgStyle}
            onClick={(e) => { this.handleImgClick(e); }}
            onMouseDown={this.handleImgMouse}
          />
        </div>
        <div className={styles.thumbList}>
          {
            imgList.map((img) => {
              const isActive = img === currentImg;
              return (
                <a
                  className={`${styles.thumbListItem} ${isActive && styles.thumbListItemActive}`}
                  onClick={this.handleThumbClick.bind(this, img)}
                >
                  <img
                    src={img.src}
                    alt="图片"
                    style={{ opacity: (isActive) ? 1 : 0.6 }}
                  />
                </a>
              );
            })
          }
        </div>
        <div className={styles.toolbar}>
          <span className={styles.toolbarIndex}>{toolbarIndex}</span>
          <div className={styles.toolbarAction}>
            {
              this.tools.map((item) => {
                const enable = this.state[item.enable];
                return (
                  <Tooltip placement="top" title={item.title} >
                    <span>
                      {
                        item.key !== 4 ? (
                          <a disabled={!enable} className={!enable ? styles.actionDisabled : ''} onClick={this.handleZoom.bind(this, item.key)}>
                            <Icon type={item.icon} />
                          </a>
                        ) : (
                          <a onClick={this.handleCloseClick}>
                            <Icon type={item.icon} style={{ fontSize: '20px' }} />
                          </a>
                        )
                      }
                    </span>
                  </Tooltip>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
