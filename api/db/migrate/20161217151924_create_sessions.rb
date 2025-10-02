class CreateSessions < ActiveRecord::Migration[5.0]
  def change
    create_table :sessions do |t|
      t.belongs_to :user, index: true
      
      t.string :ip
      t.string :description
      t.string :auth_token
      t.integer :user_id

      t.timestamps
    end
  end
end
