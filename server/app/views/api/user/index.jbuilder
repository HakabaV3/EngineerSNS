json.set! :success do
  json.array! @users do |user|
    json.id user.id
    json.uri user.uri
    json.name user.name
    json.description user.description
    json.icon user.icon
  end
end