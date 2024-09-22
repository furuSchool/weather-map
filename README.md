## Weather Map
- google map 上にお天気を表示するアプリ
- 本当はもっと細かいメッシュでの予報を出したい
- 今はローカルホストをサーバーとしている

## 環境構築
`npm i`して、python3 の環境を作って、必要なライブラリを `pip install` すればOK。`requirements.txt` はちゃんと書いていない。
- サーバーの起動：`python3 main.py`
- クライアントの起動：`npm run dev`

## 出典
- area.json：気象庁ホームページ　（https://www.jma.go.jp/bosai/common/const/area.json ）より引用
- 天気のアイコン：（https://booth.pm/ja/items/3192480 ）より利用
- noimage.png：（https://www.shoshinsha-design.com/2020/05/%E3%83%8E%E3%83%BC%E3%82%A4%E3%83%A1%E3%83%BC%E3%82%B8%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3-no-image-icon/.html ）より利用
- 地域時系列予報：（https://www.jma.go.jp/bosai/jmatile/data/wdist/VPFD/******.json ）より引用

## 参考（一部）
- https://qiita.com/michan06/items/48503631dd30275288f7
- https://qiita.com/tenpoul/items/f9e026597fcf8405680f
- https://qiita.com/yamato1413/items/2e02d1532f8779395a18
