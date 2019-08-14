const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('koa-router')()
const Mock = require('mockjs')
const cors = require('koa-cors')
const fs = require('fs')

const index = require('./routes/index')
const users = require('./routes/users')

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
 });

// error handler
onerror(app)

app.use(cors())

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// mockjs的常用mock字段
// let basicData = Mock.mock({
//   'list|1-100': [{
//       'id|+1': 1,
//       'isBoolean': '@boolean(10, 0, true)',//百分之百的true
//       'naturalNumber': '@natural(1, 1000)', //大于等于零的整数
//       'integer': '@integer(0)', //随机整数
//       'float': '@float(1, 100, 3, 6)', //随机浮点数, 
//       'character': '@character("upper")', //一个随机字符
//       'string': '@string("lower", 5, 20)', //一串随机字符串
//       'range': '@range(1, 10, 2)', //一个整形数组，步长为2
//   }]
// })

let testData = router.get('/test', async (ctx, next) => {

  data = {
    code: 200,
    data: [{
      id: '1',
      hostname: '1',
      ipv4Str: '1',
      version: '1',
      allProcessGroup: '1',
      connectedProcessGroup: '1',
      processGroup: '1',
      allMonitored: '1',
      connected: '1',
      offline: '1',
      updatetime: '1'
    }]
  }

  let res = Mock.mock({
    code: 200,
    'data|40-100': [
      {
        'id|+1': 1,
        'hostname':  '@string("lower", 5, 20)',
        'ipv4Str':  '@string("lower", 5, 20)',
        'version':  '@string("lower", 5, 20)',
        'allProcessGroup':  '@string("lower", 5, 20)',
        'connectedProcessGroup':  '@string("lower", 5, 20)',
        'processGroup':  '@string("lower", 5, 20)',
        'allMonitored':  '@string("lower", 5, 20)',
        'connected':  '@string("lower", 5, 20)',
        'offline':  '@string("lower", 5, 20)',
        'updatetime':  '@string("lower", 5, 20)',
      }
    ]
  })
  ctx.body = res
})
app.use(testData.routes(), testData.allowedMethods())

let testMd = router.get('/testMd', async (ctx, next) => {
  ctx.body = fs.readFileSync('./README.md')
})
app.use(testMd.routes(), testMd.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen('3001')
console.log('listening at 3001...')

module.exports = app
