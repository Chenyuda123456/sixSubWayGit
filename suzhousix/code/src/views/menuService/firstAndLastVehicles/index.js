import { reactive } from 'vue';
import { getLineTimeList } from '@/service/MenuFirsttrain.js';
import Protocol from '@/mixins/protocol.ts';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
export default function pageVehicle() {
  const { firstLoad } = Protocol();
  firstLoad(['onLineSETime']);
  const { t } = useI18n();
  let $route = useRoute();
  const data = reactive({
    lineList: [
      {
        name: t('line1'),
        lineNo: 1,
        value: 1
      },
      {
        name: t('line2'),
        lineNo: 2,
        value: 2
      },
      {
        name: t('line3'),
        lineNo: 3,
        value: 3
      },
      {
        name: t('line4'),
        lineNo: 4,
        value: 4
      },
      {
        name: t('lineBranchFour'),
        lineNo: 4,
        value: 7
      },
      {
        name: t('line5'),
        lineNo: 5,
        value: 5
      },
      {
        name: t('line6'),
        lineNo: 6,
        value: 6
      },
      {
        name: t('line11'),
        lineNo: 11,
        value: 11
      }
    ],
    currentIndex: 0,
    currentLineText: '1号线',
    currentList: [],
    destList: []
  });
  const getList = async (value = 1) => {
    data.currentIndex = data.lineList.findIndex(item => {
      return item.value == value;
    });
    data.currentLineText = data.lineList[data.currentIndex].name;
    let res = await getLineTimeList(data.lineList[data.currentIndex].value);
    data.currentList = res.data.result;
    data.destList = [];
    data.destList[0] = data.currentList[0].start.ename;
    data.destList[1] = data.currentList[0].end.ename;
  };
  window.onSelectline = lineName => {
    if (lineName === '线路') {
      getList(1);
    }
    if (lineName === '11号线') {
      getList(11);
    }
    if (lineName === '1号线') {
      getList(1);
    }
    if (lineName === '2号线') {
      getList(2);
    }
    if (lineName === '3号线') {
      getList(3);
    }
    if (lineName === '4号线') {
      getList(4);
    }
    if (lineName === '4号线支线') {
      getList(7);
    }
    if (lineName === '5号线') {
      getList(5);
    }
    if (lineName === '6号线') {
      getList(6);
    }
  };
  window['onLineSETime'] = option => {
    window.onSelectline(option.line);
  };
  if ($route.query && !window.$.isEmptyObject($route.query)) {
    window.onSelectline($route.query.line);
  } else {
    getList();
  }

  return { data, getList };
}
