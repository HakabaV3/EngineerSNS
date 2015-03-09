module V1
  class Comments < Grape::API
    
    resource "user" do
      
      route_param :userName do
        
        resource "comment" do

          # GET /user/:userName/comment
          params do
            requires :userName, type: String
          end
          get '', jbuilder: 'comment/index' do
            @comments = User.where(name: params[:userName]).first.comments.all
          end
        end
      end
    end
  end
end