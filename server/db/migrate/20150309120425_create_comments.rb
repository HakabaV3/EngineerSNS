class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :owner, :default => ''
      t.text :text
      t.string :target, :dafault => ''

      t.timestamps
    end
  end
end
