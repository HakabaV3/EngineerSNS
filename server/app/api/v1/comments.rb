module V1
  class Comments < Grape::API
    
    namespace 'user/:userName' do

      # GET /user/:userName/comment (Public)
      params do
        requires :userName, type: String
      end
      get 'comment', jbuilder: 'comment/index' do
        @comments = User.comments(params[:userName])
      end

      namespace 'project/:projectName' do

        resource "comment" do

          # GET /user/:userName/project/:projectName/comment (Public)
          params do
            requires :userName, type: String
            requires :projectName, type: String
          end
          get '', jbuilder: 'comment/index' do
            error!("ユーザーが見つけられません。", 404) if User.find_by(name: params[:userName]).blank?
            @projects = User.projects(params[:userName])
            @comments = @projects.find_by(name: params[:projectName]).comments
          end

          # POST /user/:userName/project/:projectName/comment (Private)
          params do
            requires :userName, type: String
            requires :projectName, type: String
            optional :text, type: String
          end
          post '', jbuilder: 'comment/new' do
            who_am_i(headers)
            @user = User.find_by(name: params[:userName])
            @project = @user.projects.find_by(name: params[:projectName])
            @comment = Comment.create(owner: @user.name, text: params[:text], user_id: @user.id, project_id: @project.id)
          end
        end
      end
    end

    namespace 'comment/:commentId' do

      # GET /comment/:commentId (Public)
      params do
        requires :commentId, type: Integer
      end
      get '', jbuilder: 'comment/show' do
        @comment = Comment.find_by(id: params[:commentId])
        error!("該当するデータがありません。", 404) if @comment.blank?
      end

      # PATCH /comment/:commentId (Private)
      params do
        requires :commentId, type: Integer
        optional :text, type: String
      end
      patch '', jbuilder: 'comment/update' do
        who_am_i(headers)
        @comment = Comment.find_by(id: params[:commentId])
        authenticated(@comment)
        @comment.text = params[:text] || @comment.text
        @comment.save
      end

      # DELETE /comment/:commentId (Private)
      params do
        requires :commentId, type: Integer
      end
      delete '', jbuilder: 'comment/delete' do
        who_am_i(headers)
        @comment = Comment.find_by(id: params[:commentId])
        authenticated(@comment)
        @comment.delete
      end
    end
  end
end