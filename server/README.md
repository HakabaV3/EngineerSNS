# server

## 開発環境

- Ruby
    - version 2.1.2
- Rails
    - version 4.1.8

## サーバー起動方法

### `初期設定`

1. MySQLのドライバを入れる

```
brew install mysql
```

2. cloneした後、必要なgemをまとめてインストール

```
$ bundle install
```

### `データベース設定`

1. MySQLのドライバを走らせる

```
$ mysqld
```

2. MySQLのデータベースを作成

```
$ rake db:create
$ rake db:migrate
```

3. データベースにテストデータを追加

```
$ rake db:seed
```

4. データベースのリセット

```
$ rake db:reset
```

### `サーバー起動`

rails serverの起動

```
$ rails s
```

## API

### `URI`

APIのURIの確認

```
$ rake api:routes
```

http://localhost:3000/api/v1/user

```
{
    "users":[
        {
            "id":1,
            "uri":" /user/kikurage",
            "name":"kikurage",
            "description":"I am Kikurage",
            "icon":"https://1tess.files.wordpress.com/2008/08/kikurage_0096.jpg"
        },
        {
            "id":2,
            "uri":" /user/stogu",
            "name":"stogu",
            "description":"I am stogu",
            "icon":"http://static.panoramio.com/photos/large/4953084.jpg"
        },
        {
            "id":3,
            "uri":" /user/jinssk",
            "name":"jinssk",
            "description":"I am jinssk",
            "icon":"http://3.bp.blogspot.com/-qvJINsskM_k/TysTXG8-k9I/AAAAAAAAAKY/h0RN1E5abyQ/s1600/davidoakesaswilliamhamleigh-16.jpg"
        }
    ]
}
```


