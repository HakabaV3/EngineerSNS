module V1
  class Projects < Grape::API

    resource "user" do

      before do
        response_header
      end

    	# GET /user/:userName/project
      params do
        requires :userName, type: String
      end
      get ':userName/project', jbuilder: 'project/index' do
        @projects = User.where(name: params[:userName]).first.projects.all
        error!("プロジェクトが見つかりません。", 404) if @projects.blank?
      end

      params do
      	requires :userName, type: String
      	requires :projectName, type: String
      end
      get ':userName/project/:projectName', jbuilder: 'project/show' do
      	@user = User.find_by(name: params[:userName])
        @project = @user.projects.find_by(name: params[:projectName])
        error!("プロジェクトが見つかりません。", 404) if @project.blank?
      end

      # POST /user/:userName/project/:projectName
      params do
        requires :userName, type: String
        requires :projectName, type: String
      end
      post ':userName/project/:projectName', jbuilder: 'project/new' do
        @user = User.where(name: params[:userName]).first
        @project = Project.create(owner: params[:userName], name: params[:projectName], user_id: @user.id)
      end

      # PATCH /user/:userName/project/:projectName


      # DELETE /user/:userName/project/:projectName
      params do
        requires :userName, type: String
        requires :projectName, type: String
      end
      delete ':userName/project/:projectName', jbuilder: 'project/delete' do
        @user = User.where(name: params[:userName]).first
        @project = @user.projects.find_by(name: params[:projectName])
        @project.delete
      end
    end
  end
end