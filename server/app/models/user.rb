class User < ActiveRecord::Base

  has_many :projects, dependent: :destroy
  accepts_nested_attributes_for :projects

  def uri
    return " /user/#{self.name}"
  end

end
