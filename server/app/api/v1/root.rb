module V1
  class Root < Grape::API
    version 'v1'

    mount V1::Auth
    mount V1::Users
    mount V1::Projects
    mount V1::Comments
  end
end