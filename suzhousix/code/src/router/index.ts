import { createRouter, createWebHashHistory } from 'vue-router';
const isWidthScreen =
  (window?.bridge?.getClientSize?.() ||
    document.documentElement.clientWidth ||
    document.body.clientWidth) > 1080;

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'outService',
      component: () => import('@views/menuService/outService/outService.vue'),
      meta: {
        banSpeech: true
      }
    },
    {
      path: '/menubuy',
      name: 'menubuy',
      component: () => {
        if (!isWidthScreen) {
          return import('../views/ticket/Index.vue');
        } else {
          return import('../views/welcome/Index.vue');
        }
      }
    },
    {
      path: '/welcome2',
      name: 'welcome2',
      component: () => import('../views/welcome/Index.vue')
    },
    {
      path: '/ttschat',
      name: 'ttschat',
      component: () => {
        if (isWidthScreen) {
          return import('../views/ttschat/TtsChatRow.vue');
        } else {
          return import('../views/ttschat/TtsChatCol.vue');
        }
      }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => {
        if (isWidthScreen) {
          return import('../views/feedback/IndexRow.vue');
        } else {
          return import('../views/feedback/IndexCol.vue');
        }
      },
      meta: {
        title: 'feedback',
        key: 'feedback',
        parent: 'menu'
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/menu/PageMenu.vue'),
      children: [
        {
          path: '/menu/menulost',
          name: 'menulost',
          component: () => {
            if (isWidthScreen) {
              return import('../views/menuService/lost/LostRow.vue');
            } else {
              return import('../views/menuService/lost/LostCol.vue');
            }
          },
          meta: {
            title: 'lostthings',
            key: 'lostthings',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menuchange',
          name: 'menuchange',
          component: () => import('../views/menu/subpages/MenuChange.vue'),
          meta: {
            title: 'transfer',
            key: 'transfer',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menuticket',
          name: 'menuticket',
          component: () => import('../views/menu/subpages/MenuTicket.vue'),
          meta: {
            title: 'ticketprice',
            key: 'ticketprice',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menutime',
          name: 'menutime',
          component: () => import('../views/menu/subpages/MenuTime.vue'),
          meta: {
            title: 'traveltime',
            key: 'menutime',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menuFirsttrain',
          name: 'menufirsttrain',
          component: () => import('../views/menu/subpages/MenuFirsttrain.vue'),
          meta: {
            title: 'schedule',
            secondTitle: 'firstAndLastVehicles',
            secondLink: 'menuFirstAndLastVehicles',
            key: 'menuschedule',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menuFirstAndLastVehicles',
          name: 'menuFirstAndLastVehicles',
          component: () => {
            if (isWidthScreen) {
              return import(
                '../views/menuService/firstAndLastVehicles/firstAndLastVehiclesRow.vue'
              );
            } else {
              return import(
                '../views/menuService/firstAndLastVehicles/firstAndLastVehiclesCol.vue'
              );
            }
          },
          meta: {
            title: 'firstAndLastVehicles',
            secondTitle: 'schedule',
            secondLink: 'menufirsttrain',
            key: 'firstAndLastVehicles',
            parent: 'menu'
          }
        },
        {
          path: '/menu/menunearby',
          name: 'menunearby',
          component: () =>
            import('../views/menuService/around/AroundAuto2.vue'),
          meta: {
            title: 'aroundsearch',
            key: 'menuaround',
            parent: 'menu'
          }
        },
        {
          path: '/menu/policy',
          name: 'policy',
          component: () => import('../views/menu/subpages/Policy.vue'),
          meta: {
            title: 'policy',
            parent: 'menu',
            key: 'policy'
          }
        },
        {
          path: '/menu/announcement',
          name: 'announcement',
          component: () => import('../views/menu/subpages/Announcement.vue'),
          meta: {
            title: 'announcement',
            parent: 'menu',
            key: 'announcement'
          }
        },
        {
          path: '/menu/service',
          name: 'service',
          component: () => {
            if (isWidthScreen) {
              return import('../views/menuService/service/ServiceRow.vue');
            } else {
              return import('../views/menuService/service/ServiceCol.vue');
            }
          },
          meta: {
            title: 'service',
            parent: 'menu',
            key: 'service'
          }
        },
        {
          path: '/menu/menunavigation',
          name: 'menunavigation',
          component: () => {
            if (isWidthScreen) {
              return import(
                '../views/menuService/navigation/MenuNavigationRow.vue'
              );
            } else {
              return import(
                '../views/menuService/navigation/MenuNavigationCol.vue'
              );
            }
          },
          meta: {
            title: 'insiteguide',
            key: 'insiteguide',
            parent: 'menu'
          }
        }
      ]
    },
    {
      path: '/card',
      name: 'card',
      redirect: '/card/chooseCardType',
      component: () => import('../views/ticketCard/index.vue'),
      children: [
        {
          path: '/card/chooseCardType',
          name: 'chooseCardType',
          component: () => import('../views/ticketCard/ChooseCardType.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/card/readCard',
          name: 'readCard',
          component: () => import('../views/ticketCard/ReadCard.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/console',
          name: 'console',
          component: () => import('../views/ticketCard/Console.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/update',
          name: 'update',
          component: () => import('@views/ticketCard/update/Update.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/makeUpTicket',
          name: 'makeUpTicket',
          component: () => import('@views/ticketCard/update/MakeUpTicket.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/refundTicket',
          name: 'refundTicket',
          component: () => import('@views/ticketCard/RefundTicket.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/updatePayGuide',
          name: 'updatePayGuide',
          component: () =>
            import('@views/ticketCard/update/payment/PayGuide.vue'),
          meta: {
            parent: 'card',
            human: true,
            banSpeech: true
          }
        },
        {
          path: '/card/updatePayResult',
          name: 'updatePayResult',
          component: () =>
            import('@views/ticketCard/update/payment/PayResult.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/card/charge',
          name: 'charge',
          component: () => import('@views/ticketCard/charge/Charge.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/chargePayGuide',
          name: 'chargePayGuide',
          component: () =>
            import('@views/ticketCard/charge/payment/PayGuide.vue'),
          meta: {
            parent: 'card',
            human: true,
            banSpeech: true
          }
        },
        {
          path: '/card/chargePayResult',
          name: 'chargePayResult',
          component: () =>
            import('@views/ticketCard/charge/payment/PayResult.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/card/journey',
          name: 'journey',
          component: () => import('@views/ticketCard/Journey.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        // eCard
        {
          path: '/card/chooseECardType',
          name: 'chooseECardType',
          component: () =>
            import('@views/ticketCard/eCard/ChooseECardType.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/card/readECard',
          name: 'readECard',
          component: () => import('@views/ticketCard/eCard/ReadECard.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/baseInfoECard',
          name: 'baseInfoECard',
          component: () => import('@views/ticketCard/eCard/BaseInfoECard.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        },
        {
          path: '/card/inputQueryECard',
          name: 'inputQueryECard',
          component: () =>
            import('@views/ticketCard/eCard/InputQueryECard.vue'),
          meta: {
            parent: 'card',
            banSpeech: true
          }
        }
      ]
    },
    {
      path: '/exitFare',
      name: 'exitFare',
      redirect: '/exitFare/chooseExitType',
      component: () => import('@/views/ticketCard/exitFare/ExitFare.vue'),
      children: [
        {
          path: '/exitFare/chooseExitType',
          name: 'chooseExitType',
          component: () =>
            import('@views/ticketCard/exitFare/ChooseExitType.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/exitFare/verifyAccount',
          name: 'verifyAccount',
          component: () =>
            import('@views/ticketCard/exitFare/freeExitFare/VerifyAccount.vue'),
          meta: {
            parent: 'card',
            human: true,
            banSpeech: true
          }
        },
        {
          path: '/exitFare/freeExitFare',
          name: 'freeExitFare',
          component: () =>
            import('@views/ticketCard/exitFare/freeExitFare/FreeExitFare.vue'),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/exitFare/moneyExitFare',
          name: 'moneyExitFare',
          component: () =>
            import(
              '@views/ticketCard/exitFare/moneyExitFare/MoneyExitFare.vue'
            ),
          meta: {
            parent: 'card'
          }
        },
        {
          path: '/exitFare/moneyFareExitPayGuide',
          name: 'moneyFareExitPayGuide',
          component: () =>
            import(
              '@views/ticketCard/exitFare/moneyExitFare/payment/PayGuide.vue'
            ),
          meta: {
            parent: 'card',
            human: true,
            banSpeech: true
          }
        },
        {
          path: '/exitFare/moneyFareExitPayResult',
          name: 'moneyFareExitPayResult',
          component: () =>
            import(
              '@views/ticketCard/exitFare/moneyExitFare/payment/PayResult.vue'
            ),
          meta: {
            parent: 'card'
          }
        }
      ]
    }
  ]
});

export default router;
