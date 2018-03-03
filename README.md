# eventapp


# getting started 

	$ npm install 


## android 

Follow the documentation here: 
https://facebook.github.io/react-native/docs/getting-started.html

Requires: 

###SDK platform 
Android 6 (make sure cicked and installed in android studio)
make sure the following packages are installed (checked) below it
Google Api's 
Android SDK platform 23
Intel x86 Atom_64 system image
Google API's Intel x86 Atom_64 System Image

###SDK tools
Android SDK Build-Tools 23.0.1

### ENV VARS 

Makre sure your local bash profile has the following 
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

Don't forget to run source ~/.bash_profile respectively after added to source. 

### Emulator

You will need to have an emulator set up with the above credentials, andr unning before running the react run code for android. 
To do this, open your emulator list in android and hit the green play button. 