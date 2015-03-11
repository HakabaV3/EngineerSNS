class AddItemToProjects < ActiveRecord::Migration
  def change
    add_reference :projects, :item, index: true
  end
end
