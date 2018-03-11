###########################################################
# Author: Aleita Train
# REST PLANNING 
# OSU ONLINE CS 496 
# Winter 2018 
# Uses google app engine and webapp2 to serve a restful api
#############################################################

from google.appengine.ext import ndb
import webapp2
import json
from format import jsonHandler, getAPIObject


class Boat(ndb.Model):
  name = ndb.StringProperty(required=True)
  type = ndb.StringProperty(required=True)
  length = ndb.IntegerProperty(required=True)
  at_sea = ndb.BooleanProperty()

class BoatHandler(webapp2.RequestHandler):

  def __init__(self, *args, **kwargs):
    self.err = False
    super(BoatHandler, self).__init__(*args, **kwargs)

  def logging(self, code, message):
    self.response.status = code
    self.response.write(message)
    self.err = True

  # tested and works returns json format with key id 
  def post(self, request):    
    try:
      body = json.loads(self.request.body)
    except ValueError:
      self.logging(405, "Error: Body is not required JSON format.")

    if not self.err:
      # all boats should start at sea
      body['at_sea'] = True
      new_boat = Boat(**body)
      new_boat.put()
      boat_dict = new_boat.to_dict()
      boat_dict['id'] = new_boat.key.urlsafe()
      boat_dict['self'] = '/boats/' + new_boat.key.urlsafe()
      self.response.write(jsonHandler(boat_dict))
 
  # tested and updates successfully
  def patch(self, id=None):
    if id:
      boat = ndb.Key(urlsafe=id).get()
      if boat:
        boat_data = json.loads(self.request.body)
        if 'name' in boat_data:
          boat.name = boat_data['name']
        if 'type' in boat_data:
          boat.type = boat_data['type']
        if 'length' in boat_data:
          boat.length = boat_data['length']
        if 'at_sea' in boat_data:
          boat.at_sea = boat_data['at_sea']
          for slip in Slip.query(Slip.current_boat == id):
            if slip.current_boat and slip.arrival_date:
              slip.current_boat = ""
              slip.arrival_date = ""
              slip.put()
        boat.put()
        boat_dict = boat.to_dict()
        self.response.write(jsonHandler(boat_dict))
      else:
        self.logging(405, "Error: Bad Id")
    else:
      self.loggin(403, "Error: Id required for PATCH")

  # tested and working, returns arrat o boat items in boats
  def get(self, id=None):
    if id:
      boat = ndb.Key(urlsafe=id).get()
      if boat:
        boat_dict= boat.to_dict()
        boat_dict['self'] = "/boats/" + id
        self.response.write(jsonHandler(boat_dict))
      else:
        self.logging(405, "Error: lacking boat ID")
    else: 
        #if no id is provided display entire list of boats
        boats = Boat.query().fetch()
        boat_dicts = {'Boats':[]}
        for boat in boats:
          id = boat.key.urlsafe()
          boat_data = boat.to_dict()
          boat_data['self'] = '/boats/' + id
          boat_data['id'] = id
          boat_dicts['Boats'].append(boat_data)
        self.response.write(jsonHandler(boat_dicts))

  #working
  def delete(self, id=None):
    if id:
      boat = ndb.Key(urlsafe=id).get()
      if boat:
        for slip in Slip.query(Slip.current_boat == id):
          if slip.current_boat:
            slip.current_boat = ""
          if slip.arrival_date:
            slip.arrival_date = ""
          slip.put()
        boat.key.delete()
        self.logging(200, "INFO: 1 boat deleted")
      else:
        self.logging(405, "ERROR: bad boat id")
    else: 
      self.logging(403, "ERROR: Id required for DELETE")


##############################################################
#
#                       SLIP MODEL
#
##############################################################
class Slip(ndb.Model):
  number = ndb.IntegerProperty(required=True)
  current_boat = ndb.StringProperty()
  arrival_date = ndb.StringProperty()
  # departure_history = ndb.StringProperty(repeat=True) 

  def prepareSlip(self):
    id = self.key.urlsafe()
    slip_data = self.to_dict()
    slip_data['id'] = id
    slip_data['self'] = '/slips/' + id
    if slip_data['current_boat'] != 'null':
      slip_data['boat_link'] = '/boats/' + slip_data['current_boat']
    return jsonHandler(slip_data)

##############################################################
#
#                       SLIP ROUTE
#
##############################################################
class SlipHandler(webapp2.RequestHandler):

  def __init__(self, *args, **kwargs):
    self.err = False
    super(SlipHandler, self).__init__(*args, **kwargs)

  def logging(self, code, message): 
    self.response.status = code
    self.response.write(message)
    self.err = True    

  def post(self, id=None):    
    try:
      body = json.loads(self.request.body)
    except:
      self.logging(405, "ERROR: Bad JSON")
    if Slip.query(Slip.number == body['number']).get(): 
      self.logging(403, "Error: A slip of that numer already exists.")
    if not self.err:
      body['current_boat'] = "null";
      # all boats should start at sea
      new_slip = Slip(**body)
      new_slip.put()
      self.response.write(new_slip.prepareSlip())

  def get(self, id=None):
    if id:
      slip = ndb.Key(urlsafe=id).get()
      if slip:
        slip_dict = slip.to_dict()
        slip_dict['self'] = "/slips/" + id
        self.response.write(jsonHandler(slip_dict))
      else:
        self.logging(405, "Error: slip.id required for GET")
    else: 
        #if no id is provided display entire list of boats
        slips = Slip.query().fetch()
        slip_dicts = {'Slips':[]}
        for slip in slips:
          id = slip.key.urlsafe()
          slip_data = slip.to_dict()
          slip_data['self'] = '/slips/' + id
          slip_data['id'] = id
          slip_dicts['Slips'].append(slip_data)

        self.response.write(jsonHandler(slip_dicts))

  def delete(self, id=None):
    if id:
      slip = ndb.Key(urlsafe=id).get()
      if slip:
        if slip.current_boat != "": 
          boats = Boat.query().fetch()
          for boat in boats:
            id = boat.key.urlsafe()
            if id == slip.current_boat:
              boat.at_sea = True
              boat.put()
        slip.key.delete()

        self.logging(200, 'INFO: 1 Slip deleted')
      else:
        self.logging(405, "ERROR: bad slip ID")
    else: 
      self.logging(403, "ERROR: slip.id required for DELETE")

  def patch(self, id=None):
    if id:
      slip = ndb.Key(urlsafe=id).get()
      if slip:
        slip_data = simplejson.loads(self.request.body)
        if 'number' in slip_data:
          if Slip.query(Slip.number == slip_data['number']).get(): 
            self.logging(403, "Error: A slip of that numer already exists.")
          slip.number = slip_data['number']
        slip.put()
        slip_dict = slip.to_dict()
        self.response.write(jsonHandler(slip_dict))
      else:
        self.logging(403, "ERROR: Bad slip ID")
    else:
      self.logging(403, "ERROR: boat.id required for PATCH")

##############################################################
#
#                  BOAT ARRIVAL HANDLER ROUTE
#
##############################################################
class BoatArrivalHandler(webapp2.RequestHandler):
  def logging(self, code, message):
      self.response.status = code
      self.response.write(message)
      self.err=True

  def put(self, slip_id):
    self.err = False
    print(self.request.body)
    err = False
    try: 
      body = json.loads(self.request.body)
    except ValueError: 
      self.logging(405, "ERROR: Bad JSON")
    if not self.err:
      boat = getAPIObject(body['boat_id'])
      if not boat:
        self.logging(405, "ERROR: Bad boat ID")
    if not self.err:
      slip = getAPIObject(slip_id)
      if not slip:
        self.logging(405, "ERROR: Bad slip ID")
    if not self.err:
      if slip.current_boat != 'null':
        self.logging(403, "ERROR: Slip occupied")
    if not self.err:
      slip.arrival_date = body['arrival_date']
      slip.current_boat = body['boat_id']
      boat.at_sea = False
      # boat.slip = slip_id
      slip.put()
      boat.put()
      slip_dict = slip.to_dict()
      boat_dict = boat.to_dict()
      # boat_dict['slip'] = '/slips' + slip_id
      self.response.write(jsonHandler(slip_dict))

