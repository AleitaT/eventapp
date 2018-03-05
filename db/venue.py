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


class Venue(ndb.Model):
  name = ndb.StringProperty(required=True)
  address = ndb.StringProperty(required=True)
  city = ndb.StringProperty(required=True)
  state = ndb.StringProperty(required=True)
  tags = ndb.StringProperty()
  description = ndb.StringProperty()
  all_ages = ndb.BooleanProperty()

class VenueHandler(webapp2.RequestHandler):

  def __init__(self, *args, **kwargs):
    self.err = False
    super(VenueHandler, self).__init__(*args, **kwargs)

  def logging(self, code, message):
    self.response.status = code
    self.response.write(message)
    self.err = True

  # 
  def post(self, request):    
    try:
      body = json.loads(self.request.body)
    except ValueError:
      self.logging(405, "Error: Body is not required JSON format.")

    if not self.err:
      # all venues should start at sea
      new_venue = Venue(**body)
      new_venue.put()
      venue_dict = new_venue.to_dict()
      venue_dict['id'] = new_venue.key.urlsafe()
      venue_dict['self'] = '/venues/' + new_venue.key.urlsafe()
      self.response.write(jsonHandler(venue_dict))
 
  def get(self, id=None):
    if id:
      venue = ndb.Key(urlsafe=id).get()
      if venue:
        venue_dict= venue.to_dict()
        venue_dict['self'] = "/venues/" + id
        self.response.write(jsonHandler(venue_dict))
      else:
        self.logging(405, "Error: lacking venue ID")
    else: 
      #if no id is provided display entire list of venues
      venues = Venue.query().fetch()
      venue_dicts = {'venues':[]}
      for venue in venues:
        id = venue.key.urlsafe()
        venue_data = venue.to_dict()
        venue_data['self'] = '/venues/' + id
        venue_data['id'] = id
        venue_dicts['venues'].append(venue_data)
      self.response.write(jsonHandler(venue_dicts))

  def patch(self, id=None):
    if id:
      venue = ndb.Key(urlsafe=id).get()
      if venue:
        venue_data = json.loads(self.request.body)
        if 'name' in venue_data:
          venue.title = venue_data['name']
        if 'address' in venue_data:
          venue.address = venue_data['address']
        if 'city' in venue_data:
          venue.city = venue_data['city']        
        if 'state' in venue_data:
          venue.state = venue_data['state']        
        if 'tags' in venue_data:
          venue.genre = venue_data['tags']
        if 'description' in venue_data:
          venue.description = venue_data['description']
        if 'all_ages' in venue_data:
          venue.all_ages = venue_data['all_ages']
        venue.put()
        venue_dict = venue.to_dict()
        self.response.write(jsonHandler(venue_dict))
      else:
        self.logging(405, "Error: Bad Id")
    else:
      self.loggin(403, "Error: Id required for PATCH")
  
  def delete(self, id=None):
    if id:
      venue = ndb.Key(urlsafe=id).get()
      if venue:
        for event in Event.query(Event.venue == id):
          if slip.current_venue:
            slip.current_venue = ""
          if slip.arrival_date:
            slip.arrival_date = ""
          slip.put()
        venue.key.delete()
        self.logging(200, "INFO: 1 venue deleted")
      else:
        self.logging(405, "ERROR: bad venue id")
    else: 
      self.logging(403, "ERROR: Id required for DELETE")

