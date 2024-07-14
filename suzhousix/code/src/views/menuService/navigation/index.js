import Protocol from '@/mixins/protocol.ts';
import navigationService from '@/service/navigationService';
import { Graph, Shape } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { useStore } from 'vuex';
export default {
  name: 'menunavigation',
  data() {
    let store = useStore();
    return {
      isWidthScreen: store.state.isWidthScreen,
      stationSearchUrl:
        /*  list: [
        {
          name: '当前设备位置',
          location: ['1280,324'],
          isLocated: true
        },
        {
          name: '非付费区扶梯',
          location: ['560,474', '888,134', '1114,474', '1960,470', '2036,124']
        },
      */ '',
      currentName: '',
      list: [],
      allIconList: [],
      bgImg: '',
      renderJson: '',
      locationArr: [],
      actArr: [0],
      leftRate: 968 / 1280,
      topRate: 52 / 65
    };
  },
  created() {
    this.stationSearchUrl = window.config.stationSearchUrl;
  },
  mounted() {
    // window?.bridge?.generateNLG('insidestation');
    const { firstLoad } = Protocol();
    firstLoad(['onStationSearch']);
    window.onStationSearch = this.updatePoi.bind(this);

    this.initGraph();
  },
  methods: {
    getPosition({ x, y }) {
      // let originX = 260;
      // let originY = 480;

      let originX = 640;
      let originY = 325;

      let resuletX;
      let resuletY;
      if (x < originX) {
        resuletX = x + (originX - x) * 0.75;
      } else {
        resuletX = x + (originX - x) * 0.75;
      }
      if (y < originY) {
        resuletY = y + (originY - y) * 0.75;
      } else {
        resuletY = y + (originY - y) * 0.75;
      }
      console.log(x, y);
      console.log(resuletX, resuletY);
      return {
        x: resuletX,
        y: resuletY
      };
    },
    async initGraph() {
      // #region 初始化画布
      const graph = new Graph({
        container: document.getElementById('map-content'),
        interacting: function (cellView) {
          return false;
        },
        mousewheel: {
          enabled: false,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3
        },
        connecting: {
          router: 'orth',
          connector: {
            args: {
              radius: 8
            }
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 20
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#C6C6C6', //#BDBDBD #C6C6C6
                  strokeWidth: 2,
                  strokeDasharray: 5,
                  targetMarker: null
                }
              },
              zIndex: 0
            });
          },
          validateConnection({ targetMagnet }) {
            return !!targetMagnet;
          }
        },
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#5F95FF',
                stroke: '#5F95FF'
              }
            }
          }
        }
      });
      // #endregion

      // #region 使用插件
      graph
        .use(
          new Transform({
            resizing: true,
            rotating: true
          })
        )
        .use(
          new Selection({
            enabled: true,
            rubberband: true,
            showNodeSelectionBox: true
          })
        )
        .use(
          new Snapline({
            enabled: true
          })
        )
        .use(
          new Clipboard({
            enabled: true
          })
        )
        .use(
          new History({
            enabled: true
          })
        );

      // #region 初始化图形
      const ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          }
        },
        items: [
          {
            group: 'top'
          },
          {
            group: 'right'
          },
          {
            group: 'bottom'
          },
          {
            group: 'left'
          }
        ]
      };
      Graph.registerNode(
        'custom-circle',
        {
          inherit: 'circle',
          width: 15,
          height: 15,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF'
            },
            text: {
              refX: 7,
              refY: 26,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fontSize: 12,
              fill: '#000'
            }
          },
          ports: { ...ports }
        },
        true
      );

      Graph.registerNode(
        'custom-image',
        {
          inherit: 'rect',
          width: 38,
          height: 38,
          markup: [
            // {
            //   tagName: 'rect',
            //   selector: 'body',
            // },
            {
              tagName: 'image'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            // body: {
            //   stroke: '#5F95FF',
            //   fill: '#5F95FF',
            // },
            image: {
              width: 38,
              height: 38
              // refX: 13,
              // refY: 16,
            },
            label: {
              refX: 19,
              refY: 50,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
              fontSize: 12,
              fill: '#000'
            }
          },
          ports: { ...ports }
        },
        true
      );

      const r6 = graph.createNode({
        shape: 'custom-circle'
      });

      // 获取所有的图例
      let getIconRes = await navigationService.getIcon();

      getIconRes.code == 200
        ? (this.allIconList = getIconRes.result.iconDataList)
        : '';
      console.log('this.allIconList', this.allIconList);
      // 获取当前站点的图例
      let getSelfIconRes = await navigationService.getSelfIcon();
      getSelfIconRes.code == 200
        ? (this.list = getSelfIconRes.result.map(item => {
            let filterRes = this.allIconList.filter(per => {
              return per.equipmentCn == item.qaQuestion;
            });
            if (filterRes.length) {
              return {
                name: item.qaQuestion,
                enName: filterRes[0].equipmentEn,
                icon: filterRes[0].iconUrl,
                location: []
              };
            } else {
              return [];
            }
          }))
        : '';

      // this.list = getIconRes.result.iconDataList;

      // 获取背景图和渲染的Json
      navigationService.getImg().then(res => {
        this.bgImg = res.result.imageUrl;
        this.renderJson = res.result.json;
        // graph.resize(968, 520);
        graph.fromJSON(JSON.parse(this.renderJson));
        if (!this.isWidthScreen) {
          graph.zoomTo(0.8, {
            center: { x: 0, y: 0 }
          });
        }
        this.graph = graph;
        this.$nextTick(() => {
          this.graph.getNodes().forEach(item => {
            // console.log(item.label);
            // console.log(item.position());
            if (item.label) {
              this.locationArr.push({
                name: item.label,
                position: item.position()
              });
            }
          });
        });

        console.log(this.locationArr);

        const poi = this.$route.query.poi;
        if (poi) {
          this.updatePoi(poi);
        }
      });
    },
    updatePoi(val) {
      console.log('page-val', val);
      console.log('this.allIconList', this.allIconList);
      let res = this.allIconList.filter(item => {
        console.log(item);
        return (
          item.alias.includes(val) ||
          item.equipmentCn.includes(val) ||
          item.equipmentEn.includes(val)
        );
      });
      console.log('res', res);
      if (res && res.length) {
        let isSome = this.list.some(item => {
          return item.name == res[0].equipmentCn;
        });
        isSome ? (this.currentName = res[0].equipmentCn) : '';
      }
    },
    perClick(per) {
      console.log(this.allIconList);
      if (this.currentName == per.name) {
        this.currentName = '';
      } else {
        this.currentName = per.name;
      }
      console.log(this.currentName);
    }
  }
};
