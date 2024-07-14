<template>
  <div class="journey">
    <div v-if="false" class="journey-l">
      <div class="journey-l-t">{{ $t('TicketInfo') }}</div>
      <div v-if="cardResult.mediumType == 0" class="journey-l-b">
        <div class="list">
          <div class="item">
            <div class="item-l">{{ $t('TicketType') }}</div>
            <div class="item-r">
              {{ cardResult['ticketType' + lang] || $t('NotObtained') }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('ticketSn') }}</div>
            <div class="item-r">
              {{ cardResult['cardLogicId'] || $t('NotObtained') }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('ticketStatus') }}</div>
            <div class="item-r">
              {{ cardSts ? cardSts : $t('NotObtained') }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('travelStatus') }}</div>
            <div class="item-r">
              {{
                cardResult['journeyStatus'] == 1
                  ? $t('NoCheckIn')
                  : cardResult['journeyStatus'] == 2
                  ? $t('CheckIn')
                  : cardResult['journeyStatus'] == 3
                  ? $t('updated')
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('expireDate') }}</div>
            <div class="item-r">
              {{
                cardResult['validity']?.length
                  ? cardResult['validity'].slice(0, 10)
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">
              {{
                cardCategoryTypeRes == 'money'
                  ? $t('remainMoney')
                  : cardCategoryTypeRes == 'frequency'
                  ? $t('remainTimes')
                  : cardCategoryTypeRes == 'day'
                  ? $t('remainDay')
                  : $t('NotObtained')
              }}
            </div>
            <div class="item-r">
              {{
                cardCategoryTypeRes == 'unclear'
                  ? $t('NotObtained')
                  : cardCategoryTypeRes == 'money'
                  ? cardResult['cardBalance'] / 100 + $t('yuan')
                  : cardCategoryTypeRes == 'frequency'
                  ? cardResult['cardBalance'] + $t('times')
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('usedBus') }}</div>
            <div class="item-r">
              {{ cardResult['lastStation' + lang] || $t('NotObtained') }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('usedTime') }}</div>
            <div class="item-r">
              {{
                cardResult['lastTransTime']?.length
                  ? cardResult['lastTransTime'].slice(0, 10) +
                    ' ' +
                    cardResult['lastTransTime'].slice(10)
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">拒绝信息</div>
            <div class="item-r">
              {{ cardResult['refuseCauseInfo' + lang] || $t('NotObtained') }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="journey-l-b">
        <div class="list">
          <div class="item">
            <div class="item-l">用户标识</div>
            <div class="item-r">
              {{ data.lastECarddata['userId'] }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站状态</div>
            <div class="item-r">
              {{
                data.lastECarddata['inStatus'] == '00'
                  ? '未进站'
                  : data.lastECarddata['inStatus'] == '01'
                  ? '已进站'
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站站点</div>
            <div class="item-r">
              {{
                data.lastECarddata['inStationName' + lang] || $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站线路</div>
            <div class="item-r">
              {{ data.lastECarddata['inLineName' + lang] || $t('NotObtained') }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站时间</div>
            <div class="item-r">
              {{
                data.lastECarddata['inTime']
                  ? data.lastECarddata['inTime'].substring(0, 10) +
                    ' ' +
                    data.lastECarddata['inTime'].substring(10)
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">出站状态</div>
            <div class="item-r">
              {{
                data.lastECarddata['outStatus'] == '00'
                  ? '未进站'
                  : data.lastECarddata['outStatus'] == '01'
                  ? '已出站'
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">出站站点</div>
            <div class="item-r">
              {{
                data.lastECarddata['outStationName' + lang] || $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">出站线路</div>
            <div class="item-r">
              {{
                data.lastECarddata['outLineName' + lang] || $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">出站时间</div>
            <div class="item-r">
              {{
                data.lastECarddata['outTime']
                  ? data.lastECarddata['outTime'].substring(0, 10) +
                    ' ' +
                    data.lastECarddata['outTime'].substring(10)
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站补登</div>
            <div class="item-r">
              {{
                data.lastECarddata['canClaimIn'] === 0
                  ? '不允许'
                  : data.lastECarddata['canClaimIn'] === 1
                  ? '允许'
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">进站撤销</div>
            <div class="item-r">
              {{
                data.lastECarddata['canCancelIn'] === 0
                  ? '不允许'
                  : data.lastECarddata['canCancelIn'] === 1
                  ? '允许'
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">{{ $t('ticketStatus') }}</div>
            <div class="item-r">
              {{
                data.lastECarddata['tripSts'] === 0
                  ? '未进站'
                  : data.lastECarddata['tripSts'] === 1
                  ? '已进站'
                  : data.lastECarddata['tripSts'] === 2
                  ? '行程结束'
                  : data.lastECarddata['tripSts'] === 3
                  ? '行程取消'
                  : $t('NotObtained')
              }}
            </div>
          </div>
          <div class="item">
            <div class="item-l">拒绝信息</div>
            <div class="item-r">
              {{
                data.lastECarddata['unconfirmableReason'] || $t('NotObtained')
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="journey-r">
      <div class="journey-r-t">
        <div
          v-if="cardResult.mediumType == 0"
          v-en="{
            fontSize: $pxToRem(24),
            lineHeight: $pxToRem(28),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }"
          class="journey-r-t-r te"
        >
          {{ $t('TransactionInfo') }}
        </div>
        <div v-else class="journey-r-t-l te">
          {{ $t('ItineraryInfo') }}
        </div>
      </div>
      <div class="journey-r-b mt-24">
        <div class="list">
          <a-table
            v-if="cardResult.mediumType == 0"
            class="wrapper"
            :columns="columnsCard"
            :custom-row="customRow"
            :data-source="data.tableData"
            bordered
            :pagination="false"
            :scroll="{ x: 1250, y: data.isWidthScreen ? 540 : 1132 }"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'transAmount'">
                {{
                  cardCategoryTypeRes == 'money'
                    ? text / 100 + $t('yuan')
                    : text + '次'
                }}
              </template>
              <!--0：充值交易，1：普通消费，2：复合消费-->
              <template v-if="column.dataIndex === 'transType'">
                {{
                  text === 0
                    ? $t('RechargeTransaction')
                    : text == 1
                    ? $t('GeneralConsumption')
                    : text == 2
                    ? $t('CompositeConsumption')
                    : '--'
                }}
              </template>
            </template>
          </a-table>
          <a-table
            v-else
            class="wrapper"
            :columns="columnsECard"
            :custom-row="customRow"
            :data-source="data.tableEData"
            bordered
            :pagination="false"
            :scroll="{ x: 1250, y: data.isWidthScreen ? 540 : 1132 }"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'inTime'">
                {{
                  text && text.length
                    ? text.substring(0, 10) + ' ' + text.substring(10)
                    : '--'
                }}
              </template>
              <template v-if="column.dataIndex === 'outTime'">
                {{
                  text && text.length
                    ? text.substring(0, 10) + ' ' + text.substring(10)
                    : '--'
                }}
              </template>
              <template v-if="column.dataIndex === 'inStatus'">
                {{
                  text == '00'
                    ? $t('notEntered')
                    : text == '01'
                    ? $t('HasEntered')
                    : ''
                }}
              </template>
              <template v-if="column.dataIndex === 'outStatus'">
                {{
                  text == '00'
                    ? $t('NotExited')
                    : text == '01'
                    ? $t('HasExited')
                    : ''
                }}
              </template>
              <template v-if="column.dataIndex === 'canClaimIn'">
                {{
                  text === 0 ? $t('NotAllowed') : text == 1 ? $t('Allowed') : ''
                }}
              </template>
              <template v-if="column.dataIndex === 'canCancelIn'">
                {{
                  text === 0 ? $t('NotAllowed') : text == 1 ? $t('Allowed') : ''
                }}
              </template>
              <template v-if="column.dataIndex === 'tripSts'">
                {{
                  text === 0
                    ? $t('notEntered')
                    : text == 1
                    ? $t('HasEntered')
                    : text == 2
                    ? $t('TripEnd')
                    : text == 3
                    ? $t('TripCancellation')
                    : '--'
                }}
              </template>
            </template>
          </a-table>
        </div>
        <!-- <div class="search-none">{{ $t('nosearchresult') }}</div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const store = useStore();
const lang = window.localStorage.getItem('lang') === 'en' ? 'En' : 'Cn';
const cardResult = computed(() => store.state.card.cardResult);
const data = reactive({
  tableData: [],
  tableEData: [],
  lastECarddata: {},
  isWidthScreen: store.state.isWidthScreen
});
// 获取票卡种类类型
const cardCategoryTypeRes = computed(() => {
  if (
    cardResult.value.cardType == 2 ||
    cardResult.value.cardType == 1 ||
    cardResult.value.cardType == 3 ||
    cardResult.value.cardType == 7 ||
    cardResult.value.cardType == 8
  ) {
    return 'money';
  } else if (
    cardResult.value.cardType == 4 ||
    cardResult.value.cardType == 5 ||
    cardResult.value.cardType == 6
  ) {
    return 'frequency';
  } else {
    return '';
  }
});
const customRow = (record, index) => {
  return {
    style: {
      'background-color': index % 2 == 0 ? '#ffffff' : '#fafafa'
    }
  };
};
const columnsCard = [
  {
    title: t('TransactionDevice'),
    dataIndex: 'transDeviceId',
    align: 'center'
  },
  {
    title:
      cardCategoryTypeRes.value == 'money'
        ? t('TransactionAmount') + '(¥)'
        : t('TransactionAmount') + '(' + t('times') + ')',
    dataIndex: 'transAmount',
    align: 'center'
  },
  {
    title: t('TransactionType'),
    dataIndex: 'transType',
    align: 'center'
  },
  {
    title: t('TransactionTime'),
    dataIndex: 'transTime',
    align: 'center'
  }
];
const columnsECard = [
  {
    title: t('TripNumber'),
    dataIndex: 'tripNo',
    align: 'center',
    width: 250
  },
  {
    title: t('MobileApplicationID'),
    dataIndex: 'appId',
    align: 'center',
    width: 450
  },
  {
    title: t('UserID'),
    dataIndex: 'userId',
    align: 'center',
    width: 250
  },
  {
    title: t('QRCodeProofForEntry'),
    dataIndex: 'inVoucherNo',
    align: 'center',
    width: 240
  },
  {
    title: t('EntryStatus'),
    dataIndex: 'inStatus',
    align: 'center',
    width: 200
  },
  {
    title: t('EntryStation'),
    dataIndex: 'inStationName' + lang,
    align: 'center',
    width: 200
  },
  {
    title: t('EntryLine'),
    dataIndex: 'inLineName' + lang,
    align: 'center',
    width: 200
  },
  {
    title: t('EntryTime'),
    dataIndex: 'inTime',
    align: 'center',
    width: 260
  },
  {
    title: t('QRCodeProofForExit'),
    dataIndex: 'outVoucherNo',
    align: 'center',
    width: 240
  },
  {
    title: t('ExitStatus'),
    dataIndex: 'outStatus',
    align: 'center',
    width: 200
  },
  {
    title: t('arrivalStation'),
    dataIndex: 'outStationName' + lang,
    align: 'center',
    width: 240
  },
  {
    title: t('ExitLine'),
    dataIndex: 'outLineName' + lang,
    align: 'center',
    width: 200
  },
  {
    title: t('ExitTime'),
    dataIndex: 'outTime',
    align: 'center',
    width: 260
  },
  {
    title: t('EntryReEntry'),
    dataIndex: 'canClaimIn',
    align: 'center',
    width: 200
  },
  {
    title: t('EntryCancellation'),
    dataIndex: 'canCancelIn',
    align: 'center',
    width: lang == 'En' ? 300 : 200
  },
  {
    title: t('Status'),
    dataIndex: 'tripSts',
    align: 'center',
    width: 200
  }
];
// 获取票卡状态 具体意思可以看 enum.ts->cardSts
const cardSts = computed(() => {
  if (cardResult.value.cardSts == 0) {
    return t('Uninitialized');
  } else if (cardResult.value.cardSts == 1) {
    return t('ForSale');
  } else if (cardResult.value.cardSts == 2) {
    return t('Sold');
  } else if (cardResult.value.cardSts == 3) {
    return t('Reclaimed');
  } else if (cardResult.value.cardSts == 4) {
    return t('BlacklistedAndLockedCard');
  } else if (cardResult.value.cardSts == 5) {
    return t('BlacklistedCardNotAllowedToEnterOrExitTheStation');
  } else if (cardResult.value.cardSts == 6) {
    return t('BlacklistedCardNotAllowedToEnterTheStation');
  } else if (cardResult.value.cardSts == 7) {
    return t('BlacklistedCardAllowedToEnterButNotExitTheStation');
  } else if (cardResult.value.cardSts == 8) {
    return t('BlacklistedCardAllowedToEnterAndExitTheStation');
  } else {
    return t('NotObtained');
  }
});

onMounted(() => {
  data.tableData = cardResult?.value?.processInfo?.transRecordList || [];
  data.tableEData = cardResult?.value?.tripRecordList || [];
  data.lastECarddata = cardResult?.value?.tripRecordList?.[0] || {};
});
</script>

<style scoped lang="scss">
.search-none {
  font-size: 30px;
  text-align: center;
  padding-top: 140px;
}

@media screen and (max-width: 1180px) {
  // 竖屏
  .ticket-info-box {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
  }
  .btn-box {
    width: 255px;
    height: 170px;
    box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    @apply flex flex-col items-center justify-center text-base text-white;
    &.btn-xingcheng {
      background: linear-gradient(270deg, #3c76ff 0%, #719bff 100%);
    }

    &.btn-chongzhi {
      background: linear-gradient(90deg, #4ade8a 0%, #39c788 100%);
    }

    &.btn-gengxin {
      background: linear-gradient(270deg, #41a9fe 0%, #71c3ff 100%);
    }

    &.btn-tuipiao {
      background: linear-gradient(270deg, #3665bf 0%, #6389d9 100%);
    }
  }
  .flex-wrap > div {
    width: 50%;
  }
  .journey {
    margin: 26px auto 0;
    border-radius: 30px;
    box-sizing: border-box;
    padding: 24px 30px;

    .journey-l {
      height: 710px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 20px;

      .journey-l-t {
        margin: 0 30px;
        padding: 30px 0;
        font-size: 36px;
        font-weight: bold;
        color: #4868c1;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px dashed #b3c5ff;
      }

      .journey-l-b {
        padding: 20px 30px;
        font-size: 26px;
        font-weight: 400;
        color: rgba(51, 51, 51, 0.6);
        line-height: 66px;
        box-sizing: border-box;
        .list {
          height: 566px;
          overflow: auto;

          &::-webkit-scrollbar {
            width: 6px;
            background: #ffffff;
          }

          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            background: #ffffff;
          }

          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
          }

          :deep .van-list__finished-text {
            margin: auto;
          }
        }
        .item {
          display: flex;

          .item-l {
            width: 186px;
          }

          .item-r {
            color: #333333;
          }
        }
      }
    }

    .journey-r {
      margin-top: 20px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 20px;

      .journey-r-t {
        border-bottom: 1px solid #e4e4e4;
        display: flex;
        margin-bottom: 20px;

        > div {
          width: 180px;
          height: 60px;
          background: #dbdbdb;
          border-radius: 8px 8px 0px 0px;
          font-size: 26px;
          font-weight: 400;
          color: rgba(51, 51, 51, 0.6);
          line-height: 60px;
          text-align: center;
        }

        .te {
          background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
          color: #fff;
        }
      }

      .journey-r-b {
        .list {
          height: 1200px;
          :deep(.ant-table-body) {
            &::-webkit-scrollbar {
              width: 6px;
              height: 6px;
              background: #ffffff;
            }

            /*定义滚动条轨道 内阴影+圆角*/
            &::-webkit-scrollbar-track {
              background: #ffffff;
            }

            /*定义滑块 内阴影+圆角*/
            &::-webkit-scrollbar-thumb {
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.2);
            }
          }

          :deep .van-list__finished-text {
            margin: auto;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1280px) {
  .journey {
    height: 758px;
    margin: 36px auto 0;
    width: 1860px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    box-sizing: border-box;
    padding: 24px 30px;
    display: flex;
    justify-content: space-between;

    .journey-l {
      width: 520px;
      height: 710px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 20px;

      .journey-l-t {
        margin: 0 30px;
        padding: 30px 0;
        font-size: 36px;
        font-weight: bold;
        color: #4868c1;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px dashed #b3c5ff;
      }

      .journey-l-b {
        padding: 20px 30px;
        height: 616px;
        box-sizing: border-box;
        font-size: 26px;
        font-weight: 400;
        color: rgba(51, 51, 51, 0.6);
        line-height: 66px;
        .list {
          overflow: auto;
          height: 100%;
          &::-webkit-scrollbar {
            width: 6px;
            background: #ffffff;
          }
          /*定义滚动条轨道 内阴影+圆角*/
          &::-webkit-scrollbar-track {
            background: #ffffff;
          }
          /*定义滑块 内阴影+圆角*/
          &::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
          }
        }

        :deep .van-list__finished-text {
          margin: auto;
        }
        .item {
          display: flex;

          .item-l {
            width: 176px;
          }

          .item-r {
            color: #333333;
          }
        }
      }
    }

    .journey-r {
      width: 1800px;
      .journey-r-t {
        border-bottom: 1px solid #e4e4e4;
        display: flex;

        > div {
          width: 180px;
          height: 70px;
          background: #dbdbdb;
          border-radius: 8px 8px 0px 0px;
          font-size: 26px;
          font-weight: 400;
          color: rgba(51, 51, 51, 0.6);
          line-height: 70px;
          text-align: center;
        }

        .te {
          background: linear-gradient(180deg, #9aafff 0%, #6b89fb 100%);
          color: #fff;
        }
      }

      .journey-r-b {
        .list {
          :deep(.ant-table-body) {
            &::-webkit-scrollbar {
              width: 6px;
              height: 6px;
              background: #ffffff;
            }

            /*定义滚动条轨道 内阴影+圆角*/
            &::-webkit-scrollbar-track {
              background: #ffffff;
            }

            /*定义滑块 内阴影+圆角*/
            &::-webkit-scrollbar-thumb {
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.2);
            }
          }

          :deep(td) {
            //padding: 9px 4px !important;
            font-size: 20px;
          }

          :deep .van-list__finished-text {
            margin: auto;
          }
        }
      }
    }
  }
}
</style>
