<h1 align="center">LMap</h1>
<p align="center">基于jquery的svg线路图</p>

## Features
- 动态渲染两种模式地铁线路图
- 支持自定义添加线路图标记
- 支持起始点线路渲染

## Installing


## Example
```js
<div id="map"></div>

<script>
import LMap from '@/components/line'

let linePathMap = new LMap.path('map') // 线路图模式
</script>
```

## API
- LMap.path(mapId, options)
```js
// 线路图模式
new LMap.path('map', {
    zoom: 4 // 初始缩放值
})
```
- LMap.text(mapId, options)
```js
// 文本模式
let lineMap = new LMap.text('map', {
    zoom: 4
})
// 更新站点信息
lineMap.updateText({
    data: [{id, text},...],
    startSiteId: siteId,
})
```
  
- LMap.event
```js
// 监听站点点击事件
let linePath = new LMap.path('map')
linePath.event.on('clickStation', (e) => {
    console.log(e.id) // 站点id
    console.log(e.name) // 站点名称
    console.log(e.position) // 站点在线路图位置
    console.log(e.siteCoord) // 站点坐标值
})
// 点击线路名称回调
linePath.event.on('clickLineName', () => {})
```
  
- LMap.marker(config)
```js
// 添加地图标记点 
let marker = new LMap.marker({  
    mapId: 'map', 
    markerId: 'stationButtonBox', // 标记id  
    content: <div>起点</div>,  // 标记内容
    position：[0,1], // 标记点的鼠标位置
    siteCoord: [200, 300], // 标记点的站点坐标
})
// 移除标记
marker.remove()
```
- 根据站点名获取站点数据
```js
let linePath = new LMap.path('map')
let site = linePath.lineData.getStationByName(siteName)
```

- 根据站点id获取站点position
```js
let linePath = new LMap.path('map')
let position = linePath.getStationPoi({
    id: siteId
})
```

- 渲染线路数据
```js
let linePath = new LMap.path('map')
linePath.showPath(pathdata)
```