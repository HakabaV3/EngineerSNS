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
  end

  mount V1::Root

end