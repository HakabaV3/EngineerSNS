module V1
  class Items < Grape::API

    namespace 'user/:userName/project/:projectName' do

      resource :path do

        # GET /user/:userName/project/:projectName/:path
        params do
          requires :userName, type: String
          requires :projectName, type: String
          requires :path, type: String
        end
        get '', jbuilder: 'item/index' do
          
        end
      end
    end
  end
end