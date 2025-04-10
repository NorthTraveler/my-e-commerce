### 页面内容：

##### 通用权限

[1.根页面和布局](http://localhost:3000/)

Logo/商品展示/全局购物车/页面跳转

[2.登录/注册页面](http://localhost:3000/login)

登录/注册/忘记密码的邮箱验证

[3.用户信息设置页面](http://localhost:3000/dashboard/settings)

名称修改/头像上传/密码修改/双因素验证

[4.产品详情页面](http://localhost:3000/products/3?id=3&productID=15&price=5&title=%E8%BF%BD%E6%A2%A6%E4%BA%BA%E7%AC%94%E8%AE%B0&type=%E7%B4%AB%E8%89%B2%E7%AC%94%E8%AE%B0&image=https://utfs.io/f/wjuWna0J2UHON0KGiPdwL5WkmVSB1izMEQxq879HN4ZbaXgl)

评论评分/增减数量/加入购物车

##### 管理权限

[5.产品创建页面](http://localhost:3000/dashboard/add-product)

创建新的产品类（名称/简介/价格）

[6.产品编辑页面](http://localhost:3000/dashboard/products)

产品编辑/产品删除/产品种类添加/产品过滤

[7.订单页面](http://localhost:3000/dashboard/orders)

订单状态/订单详情

[8.订单分析页面](http://localhost:3000/dashboard/analytics)

对顾客/销售进行简要分析

### 数据库格式：

用户账户：

user/account /emailtokens （用于验证账户）

passwordResetTokens （邮件重置密码）

twoFactorTokens （双因素验证账户）

产品：

product 创建的某类产品

productVariant 某类产品的具体变体

variantImages/tags 变体的图像/标签

reviews 评论

orders 订单

orderProduct 订单产品

数据库关联：产品和评论，产品和变体，变体和图片，变体和标签，评论和用户

订单和订单产品 

### 库使用：

整体风格：shadcn

1.登陆注册与中间件：Auth.js

2.数据库连接：drizzle+mysql

3.密码加密 bcrypt

4.表单 react-hook-form

5.邮箱验证 resend

6.密码类型错误验证 AuthError

7.图片上传 uploadthing （版本更新+数据位于西雅图/不稳定）

8.跳转动画 motion/framer

9.富文本编辑器 tiptap

10.过滤器与分页 shadcn

~~11.支付集成 Stripe~~ （国外银行卡传回方式出错）

12.销售可视化 recharts
