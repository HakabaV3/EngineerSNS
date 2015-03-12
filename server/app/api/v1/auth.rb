module V1
  class Auth < Grape::API
    
    namespace 'auth' do

      # POST /auth/signin
      params do
        requires :userName, type: String
        requires :password, type: String
      end
      post '/signin', jbuilder: '/user/show' do
        @user = User.find_by(name: params[:userName])
        error!("ユーザー名が見つかりません。", 404) if @user.blank?

        if @user.password === params[:password]
          @user.create_token
          @user.save
          token
        else
          error!("パスワードに誤りがあります。", 404)
        end
      end

      # GET /auth/me
      get '/me', jbuilder: '/user/show' do
        who_am_i(headers)
        token
      end

      # DELETE /auth
      delete '', jbuilder: '/user/delete' do
        who_am_i(headers)
        @user.token = ""
      end
    end
  end
end