import newick
import csv
import gc

jsonstring = ""
line = 0;

def addTree(tree):
    global jsonstring;
    gc.collect()
    jsonstring += "{\"name\":\""+ (tree.name[1:-12]) +"\","
    if len(tree.descendants) == 0:
        jsonstring +="\"value\":1\"},"

    else:
        jsonstring += "\"children\":[" 
        size = len(tree.descendants)
        i = 0
        for subtree in tree.descendants:
            gc.collect()
            addTree(subtree)
            if i != (size-1):
                 i += 1
            else:
                jsonstring =jsonstring[:-1]
        jsonstring += "]},"

csv_file = open('Languages.csv', mode='r', encoding="utf-8") 
csv_reader = csv.DictReader(csv_file)
for row in csv_reader:   
    if line == 0:
       line+=1
       continue;
    
    newick_string = (row['newick'].encode('ascii', 'ignore').decode("ascii"))
    trees= newick.loads(newick_string)
    for tree in trees:
       addTree(tree)
    line+=1
    if line == 1:
      break; 
        #jsonstr = "";
        #jsonstr = addTree(trees, jsonstr);
csv_file.close()
filewrite = open("something.json", mode="w")
filewrite.write(jsonstring)
filewrite.close()
