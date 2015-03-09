class Comment < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :project

  def uri
    return "/comment/#{self.id}"
  end

  def created
    return  self.created_at.strftime("%Y/%m/%d %H:%M")
  end
end
