import pandas
import numpy as np

# from sklearn import preprocessing
# from sklearn.metrics import accuracy_score
# from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier


data = pandas.read_csv('train.csv', index_col='id')
test = pandas.read_csv('__test.csv', index_col='id')

X = data.values[::, 0:3]
y = data.values[::, 5:].ravel()
testX = test.values[::, 0:3]

# Xtrain, Xtest, ytrain, ytest = train_test_split(X, y, random_state = 1)
# normalized_X = preprocessing.normalize(X)

model = KNeighborsClassifier(n_neighbors=60, metric='euclidean', p=3)

model.fit(X, y)

# predicted = model.predict(testX)
predicted_proba = model.predict_proba(testX)

header = np.array(['id,prob'])
result = np.vstack([header, predicted_proba[::, 1::]])





prediction = pandas.DataFrame(result).to_csv('prediction.csv')
