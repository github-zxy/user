//引入mongoose模块
const mongoose = require('mongoose')
//引入http超文本传输协议
const http = require('http')
//引入url路劲(path)
const url = require('url')
//引入querystring
const querystring = require('querystring')




//连接数据库
mongoose.connect('mongodb://localhost/mysql', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('数据库连接成功!'))
  .catch(err => console.log('数据库连接失败!!!'))
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
// 随便创建的数据
// User.create({ name: '你好' }).then(() => console.log())



//创建服务器
const app = http.createServer()
//为服务器添加事件
app.on('request', async (req, res) => {
  //判断客户端请求方式为get还是post
  const method = req.method
  //设置路由器
  const { pathname, query } = url.parse(req.url, true)
  //判断请求方式 get为初始化 post操作数据库

  if (method == 'GET') {
    //创建路由器和判断为那个路由
    if (pathname == '/list') {
      //查找数据库中的数据,并且重新赋值
      let users = await User.find()
      //测试
      // console.log(users);

      //导入静态页面,并且拼接数据(数据库中数据动态传进去)
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
                        <tr>
                            <td>用户名</td>
                            <td>年龄</td>
                            <td>爱好</td>
                            <td>邮箱</td>
                            <td>操作</td>
                        </tr>
                        `;
      //由于数据库传递过来为数组,需用forEach 遍历完之后为对象形式
      users.forEach(item => {


        list +=

          `<tr>
                    <td>${item.name}</td>
                            <td>${item.age}</td>
                            <td>`
        //item里面的数组也需要forEach遍历
        item.hobbies.forEach(item => {
          list += `<span>${item}</span>`

        })
        list += `</td>
                            <td>${item.email}</td><td>
                            <a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                            <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                        </td>
                    </tr>`
      })
      list +=
        `
                    </table>
                </div>
            </body>
            </html>`
      //输出数据
      res.end(list)
    } else if (pathname == '/add') {
      //引入add路由器
      let add = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>用户列表</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
            </head>
            <body>
                <div class="container">
                    <h3>添加用户</h3>
                    <form method ="POST" action="/add">
                      <div class="form-group">
                        <label >用户名</label>
                        <input name="name" type="text" class="form-control" placeholder="请填写用户名">
                      </div>
                      <div class="form-group">
                        <label>密码</label>
                        <input name="password" type="password" class="form-control" placeholder="请输入密码">
                      </div>
                      <div class="form-group">
                        <label>年龄</label>
                        <input name="age" type="text" class="form-control" placeholder="请填写年龄">
                      </div>
                      <div class="form-group">
                        <label>邮箱</label>
                        <input name="email" type="email" class="form-control" placeholder="请填写邮箱">
                      </div>
                      <div class="form-group">
                        <label>请选择爱好</label>
                        <div>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="足球" name="hobbies"> 足球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="篮球" name="hobbies"> 篮球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="橄榄球" name="hobbies"> 橄榄球
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="敲代码" name="hobbies"> 敲代码
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="抽烟" name="hobbies"> 抽烟
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="喝酒" name="hobbies"> 喝酒
                            </label>
                            <label class="checkbox-inline">
                              <input type="checkbox" value="烫头" name="hobbies"> 烫头
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
      //查找到的数据是数值,改成对象
      let user = await User.findOne({ _id: query.id })
      // 由于是checked
      let hobbies = ['足球', '篮球', '橄榄球', '敲代码', '抽烟', '喝酒', '烫头']

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

      //输出数据
      res.end(modify)
    } else if (pathname == '/remove') {
      await User.findOneAndDelete({ _id: query.id })
      res.writeHead(301, {
        Location: '/list'
      })
      res.end()
    }
  } else if (method == 'POST') {
    if (pathname == '/add') {
      //设置一个可以存储传递过来的数据
      let formData = ''
      // 接受传递过来的数据
      req.on('data', param => {
        formData += param
      })
      //处理数据,并同步上传到数据库
      req.on('end', async () => {
        // 把输入的数据类型转换成对象
        let user = querystring.parse(formData)
        //创建到服务器
        await User.create(user)
        //路由器头自动调转到list页面
        res.writeHead(301, {
          Location: '/list'
        })
        //输出数据
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

//服务器监听端口
app.listen(8080)
console.log('服务器启动成功!');
