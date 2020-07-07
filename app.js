//1.搭建网站服务器,实现客户端和服务器端的通信
//2.连接数据库,创建用户集合,向集合中插入文档
//3.当用户访问/list时,将所有用户信息查询出来 1.实现路由功能 2.呈现用户列表页面 3.从数据库中查询用户信息,将用户信息展示在列表中
//4.将用户信息和表格HTML进行拼接并将拼接的结果响应回客户端
//5.当用户访问/add时,呈现表单页面,并实现添加用户信息功能
//6.当用户访问/modify时,呈现修改页面,并实现修改用户信息功能 1.增加页面路由 呈现页面  11.在点击修改按钮时 将用户ID传递到当前页面   12.从数据库中查询当前用户信息 将用户信息展示到页面中   2.实现用户修改功能   21.指定表单的提交地址以及请求方式   22.接受客户端传递过来的修改信息 找到用户 将用户信息更改为最新的
//7.当用户访问/delete时,实现用户删除功能

//请求http协议
const http = require('http')
//使用第三方模块(包)mongoose
const mongoose = require('mongoose')
//引入入url
const url = require('url')
//字符串转化成对象模式
const querystring = require('querystring')

//连接数据库 默认接口27017
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.log('数据库连接失败'))
//创建集合规则
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true
  },
  age: {
    type: Number,
    min: 18,
    max: 80
  },
  password: String,
  email: String,
  hobbies: [String]

})

//使用规则创建集合
const User = mongoose.model('User', userSchema)

//创建服务器
const app = http.createServer()

//为服务器对象添加请求事件
app.on('request', async (req, res) => {
  //获取请求方式
  const method = req.method
  //解析请求地址
  const { pathname, query } = url.parse(req.url, true)

  if (method == 'GET') {
    if (pathname == '/list') {
      let users = await User.find()
      //打印查找的数据
      // console.log(users);

      let list = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h6>
                        <a href="/add" class="btn btn-primary">添加用户</a>
                    </h6>
                    <table class="table table-striped table-bordered">
                   `;

      users.forEach(item => {
        list +=
          `<tr>
				<td>${item.name}</td>
				<td>${item.age}</td>
                <td>`
        item.hobbies.forEach(item => {
          list += `<span>${item}</span>`
        })
        list += `</td>
                <td>${item.email}</td>
				<td>
					<a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
					<a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
				</td>
			</tr>`
      })

      list += `	</table>
            </div>
        </body>
        </html>`

      res.end(list)
    } else if (pathname == '/add') {
      let add = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3 >添加用户</h3>
                    <form method ="post" action="/add">
                      <div class="form-group">
                        <label>用户名</label>
                        <input type="text" class="form-control" placeholder="请填写用户名" name="name">
                      </div>
                      <div class="form-group">
                        <label>密码</label>
                        <input type="password" class="form-control" placeholder="请输入密码" name ="password">
                      </div>
                      <div class="form-group">
                        <label>年龄</label>
                        <input type="text" class="form-control" placeholder="请填写邮箱" name ="age">
                      </div>
                      <div class="form-group">
                        <label>邮箱</label>
                        <input type="email" class="form-control" placeholder="请填写邮箱" name="email">
                      </div>
                      <div class="form-group">
                        <label>请选择爱好</label>
                        <div>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="足球"name="hobbies"> 足球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="篮球"name="hobbies"> 篮球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="橄榄球"name="hobbies"> 橄榄球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="敲代码"name="hobbies"> 敲代码
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="抽烟"name="hobbies"> 抽烟
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="喝酒"name="hobbies"> 喝酒
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="烫头"name="hobbies"> 烫头
                            </label>
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary" >添加用户</button>
                    </form>
                </div>
            </body>
            </html>`
      res.end(add)
    } else if (pathname == '/modify') {
      //查找数据
      let user = await User.findOne({ _id: query.id })
      let hobbies = ['足球', '篮球', '橄榄球', '敲代码', '抽烟', '喝酒', '烫头']
      console.log(user);

      let modify = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3 >修改用户</h3>
                    <form method ="post" action="/modify?id=${user._id}">
                      <div class="form-group">
                        <label>用户名</label>
                        <input value="${user.name}" type="text" class="form-control" placeholder="请填写用户名" name="name">
                      </div>
                      <div class="form-group">
                        <label>密码</label>
                        <input value="${user.password}" type="password" class="form-control" placeholder="请输入密码" name ="password">
                      </div>
                      <div class="form-group">
                        <label>年龄</label>
                        <input value="${user.age}" type="text" class="form-control" placeholder="请填写年龄" name ="age">
                      </div>
                      <div class="form-group">
                        <label>邮箱</label>
                        <input value="${user.email}" type="email" class="form-control" placeholder="请填写邮箱" name="email">
                      </div>
                      <div class="form-group">
                        <label>请选择爱好</label>
                        <div>`

      hobbies.forEach(item => {
        let ishobbies = user.hobbies.includes(item)
        if (ishobbies) {
          modify += `<label class="checkbox-inline">
          <input type="checkbox" value="${item}"name="hobbies" checked> ${item}
        </label>`
        } else {
          modify += `<label class="checkbox-inline">
          <input type="checkbox" value="${item}"name="hobbies" > ${item}
        </label>`
        }
      })

      modify += `  </div>
      </div>
      <button type="submit" class="btn btn-primary" >修改用户</button>
    </form>
</div>
</body>
</html>`
      res.end(modify)
    } else if (pathname == '/remove') {
      // res.end(query.id)
      await User.findOneAndDelete({ _id: query.id })
      res.writeHead(301, {
        Location: '/list'
      })
      res.end()
    }

  } else if (method == 'POST') {
    //用户添加功能
    if (pathname == '/add') {
      //接受参数
      let formData = ''
      req.on('data', param => {
        formData += param
      })
      req.on('end', async () => {
        //字符串转化成对象模式
        let user = querystring.parse(formData)
        //由于已经是对象模式
        await User.create(user)
        res.writeHead(301, {
          Location: '/list'
        })
        res.end()

      })


    } else if (pathname == '/modify') {
      //接受参数
      let formData = ''
      req.on('data', param => {
        formData += param
      })
      req.on('end', async () => {
        //字符串转化成对象模式
        let user = querystring.parse(formData)
        //由于已经是对象模式
        await User.updateOne({ _id: query.id }, user)
        res.writeHead(301, {
          Location: '/list'
        })
        res.end()

      })
    }
  }

})

//监听端口
app.listen(3000)
console.log('服务器启动成功');
