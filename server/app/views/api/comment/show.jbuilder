json.set! :success do
  json.id @comment.id
  json.uri @comment.uri
  json.owner @comment.owner
  json.text @comment.text
  json.created @comment.created
  json.target @comment.target
end