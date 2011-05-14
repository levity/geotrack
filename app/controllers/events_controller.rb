class EventsController < ApplicationController
  
  def new
    
  end
  
  def create
    event = Event.create :latitude => params[:latitude], :longitude => params[:longitude], :data => {:name => params[:name]}
    Pusher['geotrack'].trigger!('locate', {
      :lat => event.latitude, 
      :lng => event.longitude,
      :name => params[:name]
    })
    render :text => 'ok'
  end
  
end