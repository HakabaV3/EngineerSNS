module V1
  class Users < Grape::API
    
    resource "user" do
      
      # GET /user/:userName
      params do
      end
      get '/', jbuilder:'/user/index' do
        @users = User.all
      end

      params do
        requires :name, type: String
      end
      get ':name', jbuilder:'/user/show' do
        @user = User.where(name: params[:name]).first
        error!("ユーザーが見つかりません。", 404) if @user.blank?
      end

      # POST /user/:userName
      params do
        requires :name, type: String
        optional :password, type: String
      end
      post ':name', jbuilder: '/user/new' do
        if User.where(name: params[:name]).count > 0
          error!("ユーザー登録に失敗しました。", 404)
        end
        @user = User.create(name: params[:name], password: params[:password])
      end

      # PATCH /user/:userName
      params do
        requires :name, type: String
        optional :description, type: String
        optional :icon, type: String
      end
      patch ':name', jbuilder: '/user/update' do
        @user = User.where(name: params[:name]).first
        @user.description = params[:description] || @user.description
        @user.icon = params[:icon] || @user.icon
        @user.save
      end

      # DELETE
      delete ':userName', jbuilder: '/user/delete' do

      end

    end
  end
end