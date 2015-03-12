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

    def who_am_i(headers)
      error!("X-tokenがNULLです。") if headers["X-Token"].blank?
      @user = User.find_by(token: headers["X-Token"])
      error!("ユーザーが見つかりません", 404) if @user.blank?
    end

    def token
      header "X-token", "#{@user.token}"
    end
  end

  mount V1::Root

end