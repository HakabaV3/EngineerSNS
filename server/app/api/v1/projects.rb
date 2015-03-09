module V1
  class Projects < Grape::API

    namespace 'user/:userName' do

      resource "project" do
          
        before do
          response_header
        end

        # GET /user/:userName/project
        params do
          requires :userName, type: String
        end
        get '', jbuilder: 'project/index' do
          error!("ユーザーが見つかりません。", 404) if User.find_by(name: params[:userName]).blank?
          @projects = User.projects(params[:userName])
        end

        # GET /user/:userName/project/:projectName
        params do
        	requires :userName, type: String
       	  requires :projectName, type: String
        end
        get ':projectName', jbuilder: 'project/show' do
          error!("ユーザーが見つかりません。", 404) if User.find_by(name: params[:userName]).blank?

          @projects = User.projects(params[:userName])
          @project = @projects.find_by(name: params[:projectName])
          error!("プロジェクトが見つかりません。", 404) if @project.blank?
        end

        # POST /user/:userName/project/:projectName
        params do
          requires :userName, type: String
          requires :projectName, type: String
        end
        post ':projectName', jbuilder: 'project/new' do
          @user = User.find_by(name: params[:userName])
          @project = Project.create(owner: params[:userName], name: params[:projectName], user_id: @user.id)
        end

        # PATCH /user/:userName/project/:projectName


        # DELETE /user/:userName/project/:projectName
        params do
          requires :userName, type: String
          requires :projectName, type: String
        end
        delete ':projectName', jbuilder: 'project/delete' do
          @user = User.find_by(name: params[:userName])
          @project = @user.projects.find_by(name: params[:projectName])
          @project.delete
        end
      end
    end
  end
end