
#########################################################
# Author: Aleita Train
# OSU ONLINE CS 496
# WINTER 2018
# couple of helper functions for rest plannibg
#########################################################

from google.appengine.ext import ndb
import webapp2
import json
from google.net.proto.ProtocolBuffer import ProtocolBufferDecodeError


def getAPIObject(id):
	obj = None
	try:
		obj = ndb.Key(urlsafe=id).get()
	except ProtocolBufferDecodeError:
		pass
	return obj

def jsonHandler(dict):
	return json.dumps(dict, sort_keys=True, indent=2)
