#import json

#from flask import Flask, render_template, request, redirect, Response, jsonify
#import pandas as pd
import csv

csv_file = open('Families.csv', mode='r', encoding="utf-8") 
filewrite = open("family.csv", mode="w")
filewrite.write("name, category, macroarea, macroarea, macroarea, macroarea, macroarea, macroarea\n")
csv_reader = csv.DictReader(csv_file)
line = 0
for row in csv_reader:   
    if line == 0:
       line+=1
       continue

    filewrite.write(row['id'] + ", " + row['name'] + ", " + row['category'] + ", "+row['macroareas']+ "\n")
csv_file.close()
filewrite.close()