require 'securerandom'

class User < ActiveRecord::Base

  has_many :projects, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  accepts_nested_attributes_for :projects
  accepts_nested_attributes_for :comments
  
  def uri
    return "/user/#{self.name}"
  end

  def project(project_name)
    return self.projects.find_by(name: project_name)
  end

  def create_token
    self.token = SecureRandom.hex(16)
  end

  def self.comments(name)
    return User.find_by(name: name).comments.all
  end

  def self.projects(name)
    return User.find_by(name: name).projects.all
  end

end
