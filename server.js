// 1引入
const Koa = require("koa")
const KoaRouter = require("koa-router")

// 2创建APP实例
const app = new Koa()

//4创建路由器对象，使用中间件，注册路由
const router = new KoaRouter()
app.use(router.routes())
   .use(router.allowedMethods())
 
//请求首页数据
const testData = require('./datas/index.json')
router.get('/getIndexData',function(ctx,next){
	// console.log("已到达test")
	ctx.body = testData
	
})
//请求分类页的数据
const categoryDatas= require('./datas/categoryDatas.json');
router.get('/getCategoryDatas',function(ctx,next){
	ctx.body  = categoryDatas
})




// 3监听服务器启动
app.listen("3003",function(err){
	if(err){
		console.log("服务器启动失败");
	}else{
		console.log("服务器启动成功，端口号3003")
	}
})
