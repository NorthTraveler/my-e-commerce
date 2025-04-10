#### 第一章 结构简解

1.保留页面：error/layout/page/loading
2.middleware
3.package.json/tailwind.config.ts/

#### 第二章：数据库连接  api/server

1.连接设置db/schema/config
2.迁移（代码创建数据表格式，并实际写入数据库）
3.数据库操作（增删改查）
4.隔离：交互性的放在client 服务器操作的放在server

#### 第三章：样式简介

1.统一样式（tw）以及shadcn配置
2.如何使用tailwind以及

#### 第四章：Auth   OAuth

1.clerk用于的简单的登录（免费版，简易/教程）
2.Auth.js可以数据库session以及JWT token（可选）
3.git 以及 google的数据获取与登录应用
相关文件：
1.drizzle用于数据库操作，及创建用户（user）账户（account）通过 src/schema.ts，drizzle.config.ts，src/db.ts ，src/migrate.ts
操作：

pnpm drizzle-kit generate生成迁移，

pnpm tsx src/migrate.ts推送迁移

2.auth用于登录验证，通过./auth.ts进行操作，./app/api/auth/[...nextauth]/route.ts来实现路由的登录功能
通过const session = await auth();来调取用户，并检查session状态来判断组件是否展示，其中登录后使用Signout 登出等功能

#### 第五章 添加真正的登录/注册页面

1.登录页面（auth/login/）,通过登录页面所需的内容，对其划分并添加内容，格式以及（icons），
2.提交表单（react hook形式）创建组件，useForm（react-hook-form）可以使用类型检查，默认值，useAction（进行某个操作，并根据返回值）
3.表单实际操作（createSafeActionClient() .schema() .action()保证安全 通过useAction引入，通过
4.通过form-error form-success来验证表单输出
5.添加register
通过bcrypt（@types/bcrypt）对输入的密码进行哈希加密，保证密码存入时并不简单存入数据库
6.新的表格verificationTokens = mysqlTable（"email_tokens"）
用于通过邮箱进行令牌记录
tokens：用于令牌登录
npm i @paralleldrive/cuid2 

对不能加入主键的表格进行并行,保证id能够自动填充，从而在insert中不加入默认主键
包含检验是否存在用户，
7.通过Resend（）对邮件发送，需要设置域名（防止非本地部署，）
并通过Token来验证邮箱是否可用

8.LoginAutho（AuthError）
通过AE来实现登陆错误类型验证
通过（await signIn("credentials")）
使用 credentials在auth添加登录

#### 第六章 密码重置（new-password）

新表格：newpasswordtokens（新密码令牌）
two-factor tokens（双因素令牌，用于记录双重的令牌）
使用passwordReset进行密码重置
考虑检查status状态，并禁用按钮
disabled = {status === 'executing'}
用于在处理时禁用按钮，防止重复操作

#### 第七章 登录后用户UI设计：

dropdown-menu/Avatar/Icon/Image

用于展示图像/为Icon设计hover动画/设计主题切换（dark和light）
(group-hover transition duration-number )

#### 第八章 dashboard和router(navigation)

制作settings，使用card和Form来展示个人信息与

#### 第九章 双因素验证与回调

auth添加JWT令牌并不提供信息（jwt token），需要添加会话回调（callback）依据jwt生成所需的token，
JWT 和 session Callback
在auth访问token，设置token上不同的属性，为了发挥作用，必须保存在session中，因此，访问token并保存会话中的所有新属性,如果启用twofactor，则需要在登陆时使用邮箱验证（google和git无法启用）

#### 第十章 上传！uploads for nextjs

（uploadthing）https://uploadthing.com/ 

1.withut在tailwindconfig
2.utfs.io在nextconfigmjs
3.tsx设定

#### 第十一章 渲染layout和nav

比如分个渲染Nav dashboard-nav和layout
通过import { usePathname } from "next/navigation";使用usePathname来获取path名称

通过帧动画来渲染网页跳转动画（framer.com）用来加入跳转动画

#### 第十二章 add-product

form card price rich text editor富文本编辑器
tiptap富文本编辑，加入加粗，斜体等，以及长文本的placeholder
如何让文本真正更新（onUpdate）通过onUpdate.getHTML 或者 .getJSON来实际实现

(可用sanatize用于获取HTML输入)

server（create-product）
使用Sonner 来处理hot toast(弹窗放入根节点处理问题)
npm i sonner

#### 第十三章 product management（Tonstack用于查询获取服务器数据，栈表）

1.在服务器组件（components）而非服务操作（actions）中获取
server action会发出post请求
有一种方法运行钩子 详情见columns
产品编辑模式：

#### 第十四章 过滤器和分页：见data-table通过shacn

#### 第十五章 连接变体 variants tags关联

数据    
1.表关联 如何一对多？产品variant可以有一种商品，而有许多图片和标签
2.UI设计（Tooltip/dialog）

插曲：客户端与服务端的差别
一般有异步的可以看作server compoents
当在客户端组件渲染客户端组件（）时，会正常工作
但是在客户端组件渲染

#### 第十六章 tags-input image-input

表单处理多个项目
如何键盘交互/如何
行管理，如何拖拽换顺序
页面滚动
错误：functions组件不能给refs 当使用function时，传递reference（product-variant）
在children向前 reference向后传递，必须转发ref 声明必要的泛型

#### 第十七章 创建，删除，更新variant

创建连接

#### 第十八章通过algoliasearch来产生索引

'shift' 'alt' 'f' 无敌的能力！

npm i date-fns 一个日期包显示日期距今的时间

useMemo用于实时更新改变

zustant 进行管理 页面间共享状态（react context 状态重新渲染所有使用的组件）
zustant 进行

安装进行json管理的包npm i lottie-react

通过Stripe进行支付卡片功能集成

#### 第十九章