class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.string    :description
      t.text      :data
      t.datetime  :created_at
    end
  end

  def self.down
    drop_table :events
  end
end
