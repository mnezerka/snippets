"""Flask app"""

from flask import Flask

def create_application():
    print('Creating flask application instance')
    application = Flask(__name__)

    @application.route('/')
    def hello():
        return 'hello world!'

    return application

class App:

    app = create_application()

    def __call__(self, *args):
        print('in call')
        #self.app(*args)

if __name__ == '__main__':
    #app = create_application()
    #app.run(host='0.0.0.0')
    a = App()
    a(1)
