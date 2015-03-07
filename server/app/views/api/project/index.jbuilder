json.set! :success do
  json.array! @projects do |project|
    json.id project.id
    json.uri project.uri
    json.owner project.owner
    json.name project.name
  end
end