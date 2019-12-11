To analyze the text tones, we are currently using IBM Watson Tone Analyzer API. We are using the free tier. Which allows 2,500 API calls per month. Although it is working for our current pace and size of our app, we understand the situation that it is going to be a problem - if we start getting more traffics on our website. Necessary steps that need to be done to handle this situation.

***Safeguard for API calls***
To prevent spam or unnecessary API calls - we will need to put some safeguards in place, both in front-end and back-end. For the front-end, we can put a safeguard on some common words that are used in chats - that might not necessarily carry any emotions or typos. Note that, when a typo is sent to the Tone Analyzer - it is just an unwanted cost that we pay.

***Is IBM-Watson Tone Analyzer the right service***
For a college project, yes. But, we are to expect more traffic, IBM-Watson will not be a good choice. Why? Well, first of all, it is very expensive. Following are the pricing for the IBM-Watson API calls as of (12/11/2019)

| TIERS           | PRICING  |
|:-------------:| -----:|
|   1 - 250,000 | $0.0088 USD/api call |
| 250,001 - 5,000,000    |   $0.0013 USD/api call |
| 5,000,000+  |    $0.0008 USD/api call |

And according to https://www.textrequest.com/blog/how-many-texts-people-send-per-day/ - Average American between age 18 - 34 sents and receives about 100 texts per day. So, if we call the API every time someone sends a text - that will be an average of 50 API calls/day. 
So, even if we have 1000 monthly users - that will cost us around 1.5 million API calls per month. That will cost us $1,950/month just for the IBM API call.

Even if we can fund the API calls, IBM-Watson is not a good choice, because secondly, it is not accurate. For example, it has a bug that - it cannot analyze a text with a name on it. So, it will analyze "I am happy". But cannot analyze something like "I am happy, John". I think bugs like this can be easily solved with common names. But as we don't have control over the ToneAnalyzer API, we will be stuck with whatever service they provide us.

***So what then?***
We can create our own Tone Analyzer API. We can keep using the IBM-Watson as long as we have a small number of active users. But, at the same time, we should keep working on building our algorithm to create our API. And, along the process, we can use the data (IBM-Watson API calls) that we already have saved in our database. 