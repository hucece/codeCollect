/*
 * Author: hujiajing
 * Email: hujiajing@douyu.tv
 * Date: 2018-05-31
 * Description:
 *  h5滑动组件
 */

import React from 'react';
import { any, bool, object, string } from 'prop-types';
import './index.css';


const pageDefaultProps = {
    layoutProps: {
        width: '100%',
        height: '100%'
    },
    backgroundProps: {
        backgroundColor: '#fff'
    }
};

export default class H5SliderView extends React.Component {
    static propTypes = {
        addSliderPage: any,
        isAddArrow: bool,
        arrowImg: string,
        arrowSettingStyle: object
    }
    static defaultProps = {
        layoutProps: {
            position: 'relative'
        },
        isAddArrow: true,
        arrowSettingStyle: {
            width: '32px',
            height: '32px',
            bottom: '10px'
        },
        arrowImg: ' https://cs-op.douyucdn.cn/dyfelocal/act/5b17428296ad287df53cbb94/arrow.png?timestamp=1528686014'
    };

    constructor(props) {
        super(props);
        const { children } = props;

        this.getPagesList(children);
        this.currentIndex = 0;
        this.zIndex = 2;

        this.state = {
            pageStyleList: null
        };
        this.viewHeight = props.env === 'webmarket' ? 667 : window.innerHeight;
    }

    componentDidMount() {
        const { service } = this.props;
        const sliderOuter = this.sliderView;

        this.setPageStyle();
        sliderOuter.addEventListener('touchstart', this.handleTouchStart);
        sliderOuter.addEventListener('touchmove', this.handleTouchMove);
        sliderOuter.addEventListener('touchend', this.hanldeTouchend);

        this.bindEvent('addSliderPage', () => {
            const len = service.getComponentChildrenLen();

            service.insertComponent('H5View', '', `第 ${len + 1} 页`, false, { ...pageDefaultProps }, true);
        }, true);
    }

    componentWillReceiveProps(nextProps) {
        const { children, env, service: { selectedKey } } = nextProps;

        if (env === 'webmarket' || env === '') {
            this.getPagesList(children);
            const isPageChildrenClick = selectedKey.split('>').length > 2;

            if (isPageChildrenClick) {
                return;
            }

            const isPageClick = this.pageKeyList.indexOf(selectedKey);

            this.setPageStyle();
            if (isPageClick !== -1) {
                this.goPage(isPageClick);
            }
        }
    }
    setPageStyle = () => {
        const viewHeight = this.viewHeight;
        const pageList = this.pageList;
        let styleList = [];

        if (pageList.length === 0) {
            return;
        }
        styleList = pageList.map((page, index) => {
            const { key } = page;
            const style = { transform: `translateY(${viewHeight * index}px)` };

            return { key, style };
        });
        this.setState({ pageStyleList: styleList });
    }
    updatePageStyle = () => {
        const { pageStyleList } = this.state;
        const viewHeight = this.viewHeight;
        const cIndex = this.currentIndex;
        const pIndex = cIndex - 1;
        const nIndex = cIndex + 1;

        this.zIndex += 1;
        pageStyleList[cIndex].style = {
            zIndex: this.zIndex,
            transform: 'translateY(0)'
        };

        if (pageStyleList[pIndex]) {
            pageStyleList[pIndex].style = {
                transform: `translateY(-${viewHeight}px)`
            };
        }

        if (pageStyleList[nIndex]) {
            pageStyleList[nIndex].style = {
                transform: `translateY(${viewHeight}px)`
            };
        }

        this.setState({ pageStyleList });
    }
    getPagesList = (children) => {
        this.pageList = [];
        this.pageKeyList = [];
        if (children !== null) {
            this.pageList = (children && children.length) ? children : [children];
            this.pageKeyList = (children && children.length) ? children.map(child => child.key) : [children.key];
        }
    }
    goPage = (n) => {
        const sliderLen = this.pageList.length;
        const currentIndex = this.currentIndex;
        let cidx;

        // 如果传数字 2,3 之类可以使得直接滑动到该索引
        if (typeof n === 'number') {
            cidx = n;
            // 如果是传字符则为索引的变化
        } else if (typeof n === 'string') {
            cidx = currentIndex + (n * 1);
        }

        // 当索引右超出
        if (cidx > sliderLen - 1) {
            cidx = sliderLen - 1;
            // 当索引左超出
        } else if (cidx < 0) {
            cidx = 0;
        }

        // 保留当前索引值
        this.currentIndex = cidx;
        this.updatePageStyle();
    }
    handleTouchStart = (e) => {
        // e.preventDefault();
        const touch = e.touches[0];

        this.startY = touch.pageY;
        this.startTime = new Date() * 1;

        this.offsetY = 0;
    }
    handleTouchMove = (e) => {
        // e.preventDefault();
        const touch = e.touches[0];
        const { pageStyleList } = this.state;
        const currentIndex = this.currentIndex;

        this.offsetY = touch.pageY - this.startY;
        let i = currentIndex - 1;
        const m = i + 3;

        for (i; i < m; i += 1) {
            this.zIndex += 1;
            if (pageStyleList[i]) {
                pageStyleList[i].style = {
                    zIndex: this.zIndex,
                    transform: `translateY(${((i - currentIndex) * this.viewHeight) + this.offsetY}px)`
                };
            }
        }
        this.setState({ pageStyleList });
    }
    hanldeTouchend = (e) => {
        // e.preventDefault();
        const boundary = this.viewHeight / 6;
        const deltaTime = (new Date() * 1) - this.startTime;
        const deltaY = this.offsetY;

        if (deltaTime > 300) {
            if (deltaY >= boundary) {
                this.goPage('-1');
            } else if (deltaY < 0 && deltaY < -boundary) {
                this.goPage('+1');
            } else {
                this.goPage('0');
            }
        } else {
            if (deltaY > 50) {
                this.goPage('-1');
            } else if (deltaY < -50) {
                this.goPage('+1');
            } else {
                this.goPage('0');
            }
        }
    }
    render() {
        const { style = {}, isAddArrow, arrowSettingStyle: { width, height, bottom }, arrowImg = '' } = this.props;
        const { pageStyleList } = this.state;
        const pageList = this.pageList;
        const arrowStyle = { width, height };
        const sliderViewStyle = {
            ...style,
            height: `${this.viewHeight}px`
        };

        return (
            <div className="wm-h5-sliderView" style={sliderViewStyle}
                ref={(ref) => {
                    this.sliderView = ref;
                    this.wmDom = ref;
                }}>
                {
                    pageList && pageList.length && pageStyleList ? (
                        pageList.map((page, index) => {
                            const pageStyle = pageStyleList[index];
                            const newStyle = pageStyle.key === page.key && pageStyle.style;

                            return <div className="slider-page" key={index} index={page.key} style={newStyle || {}}>{page}</div>;
                        })
                    ) : ''
                }{
                    isAddArrow && pageList && (this.currentIndex !== pageList.length - 1) ? (
                        <div className="sliderArrow" style={{ bottom }} >
                            <img src={arrowImg} style={arrowStyle} />
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

