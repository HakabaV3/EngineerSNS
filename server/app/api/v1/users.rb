module V1
  class Users < Grape::API
    
    resource "user" do
      
      before do
        response_header
      end

      # GET /user (Public)
      get '/', jbuilder:'/user/index' do
        @users = User.all
      end

      # GET /user/:userName (Public)
      params do
        requires :name, type: String
      end
      get ':name', jbuilder:'/user/show' do
        @user = User.find_by(name: params[:name])
        error!("ユーザーが見つかりません。", 404) if @user.blank?
      end

      # POST /user/:userName (Public)
      params do
        requires :name, type: String
        requires :password, type: String
      end
      post ':name', jbuilder: '/user/new' do
        if User.where(name: params[:name]).count > 0
          error!("ユーザー名は既に使用されています。", 404)
        end
        @user = User.create(name: params[:name], password: params[:password])
      end

      # PATCH /user/:userName (Private)
      params do
        requires :name, type: String
        optional :description, type: String
        optional :icon, type: String
      end
      patch ':name', jbuilder: '/user/update' do
        who_am_i(headers)
        @user.description = params[:description] || @user.description
        @user.icon = params[:icon] || @user.icon
        @user.save
      end

      # DELETE (Private)
      delete ':userName', jbuilder: '/user/delete' do
        who_am_i(headers)
        @user.delete
      end

    end
  end
end