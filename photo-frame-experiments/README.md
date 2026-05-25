# Photo Frame Experiments Package

这里保存的是 Photo Frame 项目的打包归档。

## 文件

- `photo-frame-experiments-20260525.tar.gz.b64`：项目压缩包的 base64 文本版本。

## 还原方法

在 Mac 终端里下载这个 `.b64` 文件后运行：

```sh
base64 -D -i photo-frame-experiments-20260525.tar.gz.b64 -o photo-frame-experiments-20260525.tar.gz
tar -xzf photo-frame-experiments-20260525.tar.gz
```

解压后会得到：

- `PhotoFrameApp/`：SwiftUI 原生 iOS App 和 WidgetKit 小组件尝试。
- `photo-widget-pwa/`：PWA 网页版本。
- `scriptable-photo-frame/`：Scriptable 免费小组件方案。

说明：压缩包不包含用户照片，也不包含 Xcode 本地构建缓存。
