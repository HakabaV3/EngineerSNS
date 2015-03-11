module V1
  class Comments < Grape::API
    
    namespace 'user/:userName' do

      # GET /user/:userName/comment
      params do
        requires :userName, type: String
      end
      get 'comment', jbuilder: 'comment/index' do
        @comments = User.comments(params[:userName])
      end

      namespace 'project/:projectName' do
          
        resource "comment" do

          # GET /user/:userName/project/:projectName/comment
          params do
            requires :userName, type: String
            requires :projectName, type: String
          end
          get '', jbuilder: 'comment/index' do
            error!("ユーザーが見つけられません。", 404) if User.find_by(name: params[:userName]).blank?
            @projects = User.projects(params[:userName])
            @comments = @projects.find_by(name: params[:projectName]).comments
          end

          # POST /user/:userName/project/:projectName/comment
          params do
            requires :userName, type: String
            requires :projectName, type: String
            optional :text, type: String
          end
          post '', jbuilder: 'comment/new' do
            error!("ユーザーが見つけられません。", 404) if User.find_by(name: params[:userName]).blank?
            @user = User.find_by(name: params[:userName])
            @project = @user.projects.find_by(name: params[:projectName])
            @comment = Comment.create(owner: @user.name, text: params[:text], user_id: @user.id, project_id: @project.id)
          end
        end
      end
    end

    namespace 'comment/:commentId' do

      # PATCH
      params do
        requires :commentId, type: Integer
        optional :text, type: String
      end
      patch '', jbuilder: 'comment/update' do
        error!("コメントを見つけられません。", 404) if Comment.find_by(id: params[:commentId]).blank?
        @comment = Comment.find_by(id: params[:commentId])
        @comment.text = params[:text] || @comment.text
        @comment.save
      end

    	# DELETE /comment/:commentId
      params do
        requires :commentId, type: Integer
      end
      delete '', jbuilder: 'comment/delete' do
        error!("コメントを見つけられません。", 404) if Comment.find_by(id: params[:commentId]).blank? 
        @comment = Comment.find_by(id: params[:commentId])
        @comment.delete
      end
    end
  end
end