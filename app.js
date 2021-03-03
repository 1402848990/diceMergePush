const Koa = require('koa');
// 路由
const route = require('koa-route');
const router = require('koa-router')();
// cors
const cors = require('koa2-cors');
// bodyParser
const bodyParser = require('koa-bodyparser');
// 导入接口
const Ding = require('./interface/Ding');

const app =new Koa();
app.proxy = true;

// 配置跨域
app.use(
  cors({
    origin: (ctx) => {
      // 允许跨域的地址
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','Cookie','Access-Control-Allow-Origin'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','post','OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','Set-Cookie','Access-Control-Allow-Origin']
  })
);

/**
 * 接口
 */
app.use(bodyParser());
router.use('/api/Ding', Ding);


router.get('/', async ctx => {
  ctx.body = 'index';
});

app.use(router.routes()).use(router.allowedMethods());

// server 端口号
app.listen('8088');
