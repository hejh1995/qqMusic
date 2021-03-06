# qqMusic
- 模仿qq部分界面实现简单的音乐播放器
- 项目实现前后端分离。前端使用 vue 全家桶，后端使用 koa，数据库使用 mysql，网络请求使用 axios。
- 解决前后端跨域问题使用了 JSONP 和 CORS。
- 为了提高性能，使用了图片懒加载，分页加载，组件异步加载，用字体图标代替图片图标。
- 实现简单的注册登录系统，用户的密码加密后保存到数据库，头像的文件保存在服务器，文件路径保存在数
据库，使用 session-cookie 记录用户的登录状态。
- 实现歌曲选择和播放功能
## 改进计划：
- 歌手页，采用分页加载歌手信息（以前根据每一栏的高度范围计算滑动到哪个区间，分页加载后，需要边加载边计算区块的高度，可以通过区块的个数来确定高度）
- 喜欢的歌曲和收藏的歌曲 以前采用本地保存，保存到数据库中比较好。
- uni-app实现跨端（暂时还没有思路）或者用微信小程序实现关键功能。
## 主要技术栈
- HTML5,CSS3,JS
- vue全家桶
- koa， node
- mysql
## 界面预览

* **首页** 

![image](https://github.com/hejh1995/project-img/blob/master/1.png)
![image](https://github.com/hejh1995/project-img/blob/master/2.png)
![image](https://github.com/hejh1995/project-img/blob/master/13.png)
<pre>
  - 第二张图片，左侧浮层，具体功能没有实现，只实现‘退出登录‘
  - 上拉，中间导航块会下移（模仿qq音乐）
</pre>

* **个人中心** 

![image](https://github.com/hejh1995/project-img/blob/master/3.png)

* **注册页**

![image](https://github.com/hejh1995/project-img/blob/master/5.png)
![image](https://github.com/hejh1995/project-img/blob/master/6.png)
  <pre>- 设置了各种错误提醒功能</pre>
* 登录页

![image](https://github.com/hejh1995/project-img/blob/master/4.png)

* 歌手页

![image](https://github.com/hejh1995/project-img/blob/master/7.png)
<pre>- 右侧的‘导航’和左侧的内容双向联动。</pre>
* 各个歌手页

![image](https://github.com/hejh1995/project-img/blob/master/8.png)
![image](https://github.com/hejh1995/project-img/blob/master/14.png)
<pre> 
  - 下拉，上部背景图片放大。
  - 上拉，到一定位置，上部部分变为一小块。</pre>
* 歌曲播放页

![image](https://github.com/hejh1995/project-img/blob/master/9.png)
![image](https://github.com/hejh1995/project-img/blob/master/10.png)
![image](https://github.com/hejh1995/project-img/blob/master/11.png)
![image](https://github.com/hejh1995/project-img/blob/master/12.png)
<pre> 
  - 进度条、歌曲、歌词同步
  - 可切换播放模式，添加歌曲为喜欢
  - 有音乐播放/暂停的时候，退回至其他页面，底部会有小的音乐播放器。
  - 小的音乐播放器，可以显示目前播放的歌曲列表，可以切换歌曲，切换播放模式，收藏喜欢。
  </pre>
