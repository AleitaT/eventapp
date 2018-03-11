
.PHONY: start build deploy

start: 
	dev_appserver.py db/

build:

deploy: 
	gcloud app deploy db/app.yaml

install: 
	npm install
