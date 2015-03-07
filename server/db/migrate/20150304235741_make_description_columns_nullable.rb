class MakeDescriptionColumnsNullable < ActiveRecord::Migration
  def change
    change_column :users, :description, :string, default: ""
    change_column :users, :icon, :string, default: ""
  end
end
