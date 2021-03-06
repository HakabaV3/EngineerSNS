class Project < ActiveRecord::Base

  belongs_to :user

  has_many :comments

  def uri
  	user_name = User.find_by(id: self.user_id).name
    return "/user/#{user_name}/project/#{self.name}"
  end

end
