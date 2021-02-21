from flask import Flask
from flask_cors import CORS
import twint
import preprocessor as p
import textblob as tb
import traceback

def analyzeHandle(handle):
	try:
		tweets = []
		config = twint.Config()
		config.Username = handle
		config.Limit = 100
		config.Hide_output = True
		config.Store_object = True
		config.Store_object_tweets_list = tweets
		
		twint.run.Search(config)
		
		tweetsCleaned = []
		
		for tweet in tweets:
			tweetsCleaned.append(p.clean(tweet.tweet))
		
		def getSubjectivity(text):
			return tb.TextBlob(text).sentiment.subjectivity
		
		def getPolarity(text):
			return tb.TextBlob(text).sentiment.polarity
		
		if len(tweetsCleaned) > 0:
			totalPolarity = 0.0
			totalSubjectivity = 0.0
			for tweet in tweetsCleaned:
				totalPolarity += getPolarity(tweet)
				totalSubjectivity += getSubjectivity(tweet)
			totalPolarity /= len(tweetsCleaned)
			totalSubjectivity /= len(tweetsCleaned)
			return [1, totalPolarity, totalSubjectivity]
		else:
			return [0, 0, 0]
	except:
		traceback.print_exc()
		return [0, 0, 0]

app = Flask(__name__)
CORS(app)

@app.route('/')
@app.route('/<query>')
def analyze_twitter_user(query=""):
	temp = analyzeHandle(query)
	if temp[0] == 1:
		return str(temp[1]) + " " + str(temp[2])
	else:
		return "invalid"

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=49802)
