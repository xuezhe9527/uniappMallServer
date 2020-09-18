// 1引入
const Koa = require("koa")
const KoaRouter = require("koa-router")
const jwt = require('jsonwebtoken')
const Fly = require("flyio/src/node")
const fly = new Fly


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

//首页切换到其他导航栏（居家生活和美食等）的数据（即首页的分类数据）
const indexCateList = require('./datas/indexCateList.json')
router.get('/getindexCateList',async function(ctx,next){
	//用一个定时器模拟网络不好的情况,
	await new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve()			
		},2000)
	}),
	ctx.body = {
		code : 200,
		data : indexCateList
	}
	
	// 不能这样直接写一个定时器，因为定时器本身会到流程队列去排队，不影响代码继续向下的执行，cateList里面的await得到的是一个空的结果，会报错
	// setTimeout(()=>{
	// 	ctx.body = {
	// 		code : 200,
	// 		data : indexCateList
	// 	}
	// },2000)
})
//
const goods = require('./datas/goods.json');
//根据传递过来的goodId信息与所有商品的id匹配，相同则返回这个商品的所有详细数据
router.get('/getGoodDetail',(ctx,next)=>{
	let {id} = ctx.query;
	// console.log(id)
	let good = goods.find(item=>item.id===id*1)
	// console.log(good) 
	ctx.body=good
})
	
router.get('/getOpenId',async (ctx,next)=>{
	let {code} = ctx.query
	let appid = "wxc84606c6879586a2"
	let appSecret = "72c3e3aba1f87e48c8dd4d408edc30ad"
	let data;
	// GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
	let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
	let result1 = await fly.get(url)
	data = JSON.parse(result1.data)
	let {openid,session_key} = data
	// 盐 ,可认位是加密和解密密钥
	let salt = "xuezhe"
	console.log('加密前openid',openid)
	let token = jwt.sign(openid,salt)
	console.log('加密后token',token)
	//一般在业务请求中进行解密
	
	//一般可以在其他业务需求页面中拿到token然后解密获取openid，这里只做演示
	let newOpenId = jwt.verify(token,salt);
	console.log('解密后newOpenId',newOpenId)
	// ctx.body = openid
	ctx.body = token
})
// 3监听服务器启动
app.listen("3003",function(err){
	if(err){
		console.log("服务器启动失败");
	}else{
		console.log("服务器启动成功，端口号3003")
	}
})
