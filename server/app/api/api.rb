class API < Grape::API

  prefix 'api'

  version 'v1', :using => :path

  format :json
  formatter :json, Grape::Formatter::Jbuilder

  mount V1::Root
end