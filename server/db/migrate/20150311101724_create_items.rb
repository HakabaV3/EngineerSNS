class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :owner
      t.string :name
      t.string :type
      t.string :path

      t.timestamps
    end
  end
end
