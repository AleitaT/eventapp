###########################################################
# Author: Aleita Train
# OSU ONLINE CS 496
# Winter 2018 
# Uses google app engine and webapp2 to serve a restful api
#############################################################

from google.appengine.ext import ndb
import webapp2
import json
from format import jsonHandler, getAPIObject

class Event(ndb.Model):
  title = ndb.StringProperty(required=True)
  date = ndb.StringProperty(required=True)
  venue = ndb.StringProperty()
  city = ndb.StringProperty(required=True)
  state = ndb.StringProperty(required=True)
  genre = ndb.StringProperty()
  description = ndb.StringProperty()
  all_ages = ndb.BooleanProperty()

class EventHandler(webapp2.RequestHandler):

  def __init__(self, *args, **kwargs):
    self.err = False
    super(EventHandler, self).__init__(*args, **kwargs)

  def logging(self, code, message):
    self.response.status = code
    self.response.write(message)
    self.err = True

  def post(self, request):    
    try:
      body = json.loads(self.request.body)
    except ValueError:
      self.logging(405, "Error: Body is not required JSON format.")

    if not self.err:
      # all events should start at sea
      new_event = Event(**body)
      new_event.put()
      event_dict = new_event.to_dict()
      event_dict['id'] = new_event.key.urlsafe()
      event_dict['self'] = '/events/' + new_event.key.urlsafe()
      self.response.write(jsonHandler(event_dict))
 
  def get(self, id=None):
    if id:
      event = ndb.Key(urlsafe=id).get()
      if event:
        event_dict= event.to_dict()
        event_dict['self'] = "/events/" + id
        self.response.write(jsonHandler(event_dict))
      else:
        self.logging(405, "Error: lacking event ID")
    else: 
        #if no id is provided display entire list of events
        events = Event.query().fetch()
        event_dicts = {'events':[]}
        for event in events:
          id = event.key.urlsafe()
          event_data = event.to_dict()
          event_data['self'] = '/events/' + id
          event_data['id'] = id
          event_dicts['events'].append(event_data)
        self.response.write(jsonHandler(event_dicts))

  def patch(self, id=None):
    if id:
      event = ndb.Key(urlsafe=id).get()
      if event:
        event_data = json.loads(self.request.body)
        if 'title' in event_data:
          event.title = event_data['title']
        if 'date' in event_data:
          event.date = event_data['date']
        if 'venue' in event_data:
          event.venue = event_data['venue']
          # check to see if venue exists error if not
          # to do 
        if 'city' in event_data:
          event.city = event_data['city']        
        if 'state' in event_data:
          event.state = event_data['state']        
        if 'genre' in event_data:
          event.genre = event_data['genre']
        if 'description' in event_data:
          event.description = event_data['description']
        if 'all_ages' in event_data:
          event.all_ages = event_data['all_ages']
        event.put()
        event_dict = event.to_dict()
        self.response.write(jsonHandler(event_dict))
      else:
        self.logging(405, "Error: Bad Id")
    else:
      self.loggin(403, "Error: Id required for PATCH")
  
  def delete(self, id=None):
    if id:
      event = ndb.Key(urlsafe=id).get()
      event.key.delete()
      self.logging(200, "INFO: 1 event deleted")
    else: 
      self.logging(403, "ERROR: Id required for DELETE")

