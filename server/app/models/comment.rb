class Comment < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :project

  def uri
    return "/comment/#{self.id}"
  end

  def created
    return  self.created_at.strftime("%Y/%m/%d %H:%M")
  end

  def target
  	@project = Project.find_by(id: self.project_id)
  	@user = User.find_by(id: @project.user_id)
    return "/#{@user.name}/project/#{@project.name}"
  end
  
end
