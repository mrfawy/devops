import os
import ntpath
import re
import argparse
import xlsxwriter

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'

class Record:
    def __init__(self,file_name="",file_path="",line_number="",line=""):
        self.file_name=file_name
        self.file_path=file_path
        self.line_number=line_number
        self.line=line

class PatternResult:
    def __init__(self,pattern=""):
        self.pattern=pattern
        self.records=[]
        self.matching_files_num=0
        self.total_files_num=0
        self.files_containing_pattern=[]
        
    def add_record(self,record):
        self.records.append(record)
    
def remove_special_chars(str):
    specials=["[","]",":","*","?","/","\\"]
    replace="#"
    res=str
    for ch in specials:
       res=res.replace(ch,replace)
    return res

def get_filepaths(directory,skip_pattern):
  
    file_paths = []  # List which will store all of the full filepaths.
    # Walk the tree.
    for root, directories, files in os.walk(directory):
        for filename in files:
            # Join the two strings in order to form the full filepath.
            filepath = os.path.join(root, filename)
            if not skip_pattern  in filepath:
                file_paths.append(filepath)  
    return file_paths  

def contains_pattern(filepath, pattern):    
    with open(filepath) as f:       
        for line in f:
            if  re.search(pattern, line.lower(),re.IGNORECASE):                
                return True           
    return False

def detect_matching_lines(filepath, pattern,patternResult):
    lineNumber=0;     
    with open(filepath) as f:     
        for line in f:
            if  re.search(pattern, line.lower(),re.IGNORECASE):                            
                record=Record(ntpath.basename(filepath),filepath,str(lineNumber),line.strip())
                patternResult.add_record(record)                
            lineNumber+=1    
    
def print_result(res):
    print "======================== Results ========================"
    for r in res:
        print "-------------------------------------------------------"
        print r.pattern +"  "+"matched in ["+r.matching_files_num +"/"+r.total_files_num+"]"
        print "--------------------------------------------------------"        
        for record in r.records:
            print "FILE:"+record.file_name+" LINE# "+record.line_number+":"+bcolors.HEADER+record.line+bcolors.ENDC

def write_CSV(res,dir_path):    
    print " create directory  : "+dir_path
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    for r in res:
        file_name=remove_special_chars(r.pattern)+".CSV"
        f=open(dir_path+"/"+file_name,"w")
        f.write("File \t Path \t line number \tline \n")      
        for record in r.records:
            f.write(record.file_name+"\t"+record.file_path+"\t"+record.line_number+"\t"+record.line+"\n")            
        f.close()

def write_xls(res,xls_file):
    print "Writing Results to "+xls_file 
    
    # Create a workbook and add a worksheet.
    workbook = xlsxwriter.Workbook(ntpath.basename(xls_file))
    for r in res:
        worksheet = workbook.add_worksheet(remove_special_chars(r.pattern))
        
        row=0;
        col=0;
        worksheet.write(row, 0, "File Name ")
        worksheet.write(row, 1,  "File Path")
        worksheet.write(row, 2,    "Line number")
        worksheet.write(row, 3,    "Line Contents")       
        for record in r.records:
            row+=1
            worksheet.write(row, 0,record.file_name)
            worksheet.write(row, 1,  record.file_path)
            worksheet.write(row, 2,    record.line_number)        
            
            line=record.line             
            try:
                line =unicode(record.line)
            except:
                print bcolors.WARNING+" NON Ascii chars , please check: "+record.file_path +"\t @ line # :"+record.line_number+bcolors.ENDC
                line=" This line contains non Ascii characters , please check"
                format = workbook.add_format()
                format.set_font_color('red')   
                worksheet.write(row, 3,   line,format)                 
            else:                
                worksheet.write(row, 3,   line)
    workbook.close()

def process_patterns(patterns,full_file_paths):
    print "Starting Python processing"
    results=[]
    for pattern in patterns:
        print "Cheking for pattern :"+ pattern
        patternResult=PatternResult(pattern) 
        files_containing_pattern=[]
        for filepath in full_file_paths:        
            detect_matching_lines(filepath,pattern,patternResult)
        
        total_files_num=str(len(full_file_paths))
        matching_files_num=str(len(files_containing_pattern));
        patternResult.matching_files_num=matching_files_num
        patternResult.files_containing_pattern=files_containing_pattern
        patternResult.total_files_num=total_files_num
        results.append(patternResult)
    return results

# Start of the Script 
parser = argparse.ArgumentParser()
parser.add_argument("path", help="directory path to start scanning ")
parser.add_argument("-x", help="Excel file to store the results .Default:scan_results.xls",default="scan_results.xls")
parser.add_argument("-v", "--verbose", help="increase output verbosity",
                    action="store_true")
parser.add_argument("-p","--pattern",nargs = '*' , help="list of pattern(s) to match ,please refer to Python Regex documentation .Default:'/download/' '/manuals' '/HelpDoc' '/reports/'",action="append",default=[["/download/","/manuals","/HelpDoc","/reports/"]])

 
args = parser.parse_args()
DIR_PATH=args.path
VERBOSE=args.verbose
RESULTS_FILE = args.x
PATTERNS=args.pattern
full_file_paths = get_filepaths(DIR_PATH,".svn")
results=process_patterns(PATTERNS[-1],full_file_paths) # -1  to always get the last , as if parm is submitted it's appended
write_xls(results,RESULTS_FILE)
print "DONE"
#print_result(results)
#write_CSV(results,RESULTS_DIR)
"""
print "Double Check a quick search via Linux shell "
for pattern in patterns:
    cmdparams="grep -rnw ~/"+DIR_PATH+ " -e "+ "\""+pattern+ "\""
    print "trying with shell command: "+cmdparams
    os.system(cmdparams)
"""
