json.set! :success do
  json.id @user.id
  json.uri @user.uri
  json.name @user.name
  json.description @user.description
  json.icon @user.icon
end