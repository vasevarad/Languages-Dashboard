import json

from flask import Flask, render_template, request, redirect, Response, jsonify
import pandas as pd
#First of all you have to import it from the flask module:
app = Flask(__name__)
#By default, a route only answers to GET requests. You can use the methods argument of the route() decorator to handle different HTTP methods.
@app.route("/", methods = ['POST', 'GET'])
def index():
    #df = pd.read_csv('data.csv').drop('Open', axis=1)
    global family_info
    #The current request method is available by using the method attribute
    if request.method == 'POST':
        if request.form['data'] == 'get_info':
            family = request.form['family']
            family = family.replace(" ", "")
            print(family)
            data = family_info[family_info["Name"] == family]
            chart_data = data.to_dict(orient='records')
            chart_data = json.dumps(chart_data, indent=2) 
            data = {'data': chart_data}
            return data
             


        data=[]

        # data = {'chart_data': chart_data}
        return jsonify(data) # Should be a json string

    data = family_info[['Name', 'child_language_countName', 'index']]
    chart_data = data.to_dict(orient='records')
    chart_data = json.dumps(chart_data, indent=2)
    data = {'chart_data': chart_data}
    return render_template("index.html", data=data)

# @app.route("/member", methods = ['POST', 'GET'])
# def index():
    ###


if __name__ == "__main__":
    family_info = pd.read_csv('static/families_info.csv', encoding ='windows-1252')
    family_info['index'] = range(len(family_info))
    app.run(debug=True)
