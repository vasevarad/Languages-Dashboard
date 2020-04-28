import newick
import csv

def addTree(tree, jsonstring):
    jsonstring += "{name:"+ (tree.name[1:-12]) +",";
    jsonstring += "children:" 
    
    for subtree in tree.descendants:
        jsonstring += addTree(subtree, jsonstring)
    jsonstring += "}"
    return jsonstring


line = 0;
with open('Languages.csv', mode='r', encoding="utf-8") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:   
        if line == 0:
            line+=1
            continue;
    
        newick_string = (row['newick'].encode('ascii', 'ignore').decode("ascii"))
        trees= newick.loads(newick_string)
        jsonstring = ""
        for tree in trees:
            jsonstring += addTree(tree, jsonstring)
        line+=1
        if line == 242:
            break; 
        #jsonstr = "";
        #jsonstr = addTree(trees, jsonstr);

        print(jsonstring)
