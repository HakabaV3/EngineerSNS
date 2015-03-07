module V1
  class Root < Grape::API
    version 'v1'

    mount V1::Users
    mount V1::Projects
  end
end