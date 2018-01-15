'''
This script reformats a CSV dataset to a JSON dataset
'''

import csv
import json
from pprint import pprint

# opens the csv file for reading and the json file for writing
csvFile = open('GDPperCapita.csv', 'r')
jsonFile = open('GDPperCapita.json', 'w')

reader = list(csv.reader(csvFile))
data = {}

count = 0
# writes the json file
for row in reader:
	for col, i in enumerate(row):
		if count == 0:
			if col != 0:
				data[i] = {}
		else:
			if col > 0:
				year = reader[0][col]
				land = row[0]
				data[year][land] = float(row[col])
	count += 1

json.dump(data, jsonFile)
jsonFile.write('\n')

pprint(data)
#reader = hele file
#reader[0] = eerste row
#reader[0][0] = eerste element van eerste row