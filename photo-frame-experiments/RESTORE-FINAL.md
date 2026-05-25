# Photo Frame 还原说明

请使用这个说明，不要用旧 README 里的单个 `.b64` 文件。旧的单文件上传被截断了。

## 需要下载的分片

- `archive-parts-v2-corrected/photo-frame-experiments-20260525.tar.gz.b64.part-00`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-01`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-02`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-03`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-04`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-05`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-06`
- `archive-parts-v2/photo-frame-experiments-20260525.tar.gz.b64.part-07`
- `archive-parts-v2-corrected/photo-frame-experiments-20260525.tar.gz.b64.part-08`

## 还原命令

把上面 9 个文件下载到同一个文件夹后，按顺序重命名为：

```text
part-00
part-01
part-02
part-03
part-04
part-05
part-06
part-07
part-08
```

然后运行：

```sh
cat part-* > photo-frame-experiments-20260525.tar.gz.b64
base64 -D -i photo-frame-experiments-20260525.tar.gz.b64 -o photo-frame-experiments-20260525.tar.gz
tar -xzf photo-frame-experiments-20260525.tar.gz
```

解压后会得到 `PhotoFrameApp/`、`photo-widget-pwa/`、`scriptable-photo-frame/`。
