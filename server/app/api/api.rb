class API < Grape::API

  prefix 'api'

  version 'v1', :using => :path

  format :json
  formatter :json, Grape::Formatter::Jbuilder

  helpers do
    def response_header
      header "Access-Control-Allow-Origin", "*"
      header "Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"
    end

    def token
      header "X-token", "#{@user.token}"
    end

    def who_am_i(headers)
      error!("X-tokenがNULLです。", 400) if headers["X-Token"].blank?
      @user = User.find_by(token: headers["X-Token"])
      error!("ユーザーが見つかりません", 401) if @user.blank?
    end

    def authenticated(obj)
      error!("該当するデータがありません。", 404) if obj.blank?
      error!("権限がありません。", 403) if @user.name != obj.owner
    end
  end

  mount V1::Root

end