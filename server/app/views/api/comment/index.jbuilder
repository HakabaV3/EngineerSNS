json.set! :success do
  json.array! @comments do |comment|
    json.id comment.id
    json.uri comment.uri
    json.owner comment.owner
    json.text comment.text
    json.created comment.created
    json.target comment.target
  end
end