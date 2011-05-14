class Event < ActiveRecord::Base
  acts_as_geocodable
  serialize :data
  
  attr_accessor :latitude, :longitude
  
  def to_location
    Graticule::Location.new :latitude => latitude, :longitude => longitude
  end
end
