class User < ActiveRecord::Base

  has_many :projects, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  accepts_nested_attributes_for :projects
  accepts_nested_attributes_for :comments

  def uri
    return "/user/#{self.name}"
  end

end
