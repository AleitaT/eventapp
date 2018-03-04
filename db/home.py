#########################################################
# Author: Aleita Train
# OSU ONLINE CS 496
# WINTER 2018
# use 'make start' in the top directory to run locally
#########################################################

from google.appengine.ext import ndb
import webapp2
import json

from venue import Venue, VenueHandler
from event import Event, EventHandler

class MainPage(webapp2.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'
    self.response.write('Hello, World!')
    from datetime import datetime
    self.response.write(str(datetime.now()))


allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH', 'PUT',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods
app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/venues', VenueHandler),
    ('/venues/(.*)', VenueHandler),
    ('/events', EventHandler),
    #('/events/(.*)/venue', BoatArrivalHandler),
    ('/events/(.*)', EventHandler),
], debug=True)
