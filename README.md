# 真心话大冒险

一个手机浏览器就能玩的本地网页小游戏。

## 项目文件

```text
index.html   页面结构
styles.css   页面样式
script.js    游戏逻辑
.nojekyll    GitHub Pages 静态发布标记
```

## 怎么运行

直接打开 `index.html` 就可以玩。

如果想用本地服务器预览，可以在当前目录运行：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://localhost:4173
```

## 怎么发布到 GitHub Pages

1. 把这个项目上传到 GitHub 仓库。
2. 打开仓库页面，进入 `Settings`。
3. 在左侧找到 `Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选择 `/root`。
6. 保存后等待 1 到 3 分钟。
7. GitHub 会生成一个可以分享的网址，通常类似：

```text
https://你的用户名.github.io/仓库名/
```

## 已有功能

- 添加和删除玩家
- 当前玩家自动轮换
- 真心话 / 大冒险随机抽题
- 再来一题
- 自定义真心话和大冒险题库
- 使用浏览器本地存储保存数据
- 手机和桌面端自适应界面

## 说明

这是纯前端静态网页，不需要服务器和数据库。每个人添加的玩家和自定义题目会保存在自己设备的浏览器里，不会同步给其他人。
