import Vue from "vue";
import Router from "vue-router";

// 用户端使用
import Bed from "src/page/bed/bed";
import Manager from "components/manager/manager";
import Order from "components/order/order";
import OrderDetail from "components/orderDetail/orderDetail";

import Serial from "components/serial/serial";
import UseDing from "components/useDing/useDing";
import CloseLock from "components/closeLock/closeLock";
import FeedBack from "components/feedback/feedback";

// 我的
import My from "src/page/my/my";
import Balance from "components/balance/balance";
import Person from "components/person/person";

import Login from "components/login/login";
import Deposit from "components/deposit/deposit";
Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      redirect: "/bed"
    },
    {
      path: "/bed",
      name: "bed",
      component: Bed,
      children: [{
          path: "/bed/serial",
          name: "serial",
          component: Serial
        },
        {
          path: "/bed/manager",
          name: "manager",
          component: Manager,
          children: [{
            path: "/bed/manager/deposit",
            name: "deposit",
            component: Deposit
          }]
        },
        {
          path: "/bed/useDing",
          name: "useDing",
          component: UseDing,
          children: [{
              path: "/bed/useDing/closeLock",
              name: "closeLock",
              component: CloseLock
            },
            {
              path: "/bed/useDing/feedback",
              name: "feedback",
              component: FeedBack
            }
          ]
        }
      ]
    },
    {
      path: "/bed/manager/order",
      name: "order",
      component: Order,
      children: [{
        path: ":id",
        component: OrderDetail
      }]
    },
    {
      path: "/my",
      name: "my",
      component: My,
      children: [{
          path: "/my/login",
          name: "login",
          component: Login
        },
        {
          path: "/my/person",
          name: "person",
          component: Person
        },
        {
          path: "/my/balance",
          name: "balance",
          component: Balance
        },
        {
          path: "/my/deposit",
          name: "myDeposit",
          component: Deposit
        },
        {
          path: "/my/order",
          name: "myOrder",
          component: Order,
          children: [{
            path: ":id",
            component: OrderDetail
          }]
        }
      ]
    }
  ]
});
