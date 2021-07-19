"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
const tslib_1 = require("tslib");
const faker_1 = tslib_1.__importDefault(require("faker"));

const getTransactions = (req, res) => {
    return res.json({
        code: 0,
        result: {
          userId: "3",
          username: "jacob",
          realName: "Hello Jacob",
          avatar: "https://q1.qlogo.cn/g?b=qq&nk=10000&s=640",
          desc: "manager",
          password: "123456",
          token: faker_1.default.datatype.uuid(),
          roles: [
            {
              "roleName": "Super Man",
              "value": "super"
            }
          ]
        },
        message:"ok",
        type:"success"
    });
};
exports.getUserInfo = getTransactions;
