# Initial thought and codes to create model and define strategy
# Option for strategies: Moving momentum, moving average
# Moving momentum: Sort 1-year-return, removing low momentum or negative return stocks, recommend for user 
# high momentum return stock or value base on price (1yearreturn/currentprice).


#Machine learning: compare prices between today and yesterday
#supervised, unsupervised, and reinforcement learning algorithms

# Import libaries
import numpy as np
import pandas as pd
import math
import xlsxwriter
from sklearn.ensemble import RandomForestClassifier


# Historical data needs to be in a csv format
# Load historical stock data. The visualization needs to show price on yesterday, today
data = pd.read_csv('path_to_data.csv')

data['Tomorrow'] = data['TodayClose'].shift(-1)

# Create another column to parameterize (0 or 1) if tomorrow's opening is higher than today's close. Feed this to ML.
data["Target"] = (data["Tomorrow"] > data["TodayClose"]).astype(int)

