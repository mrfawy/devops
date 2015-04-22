package dashboard

class ControllerResponse {
    def code
    def status
    def message

    static def  OK = "0000"
    static def  NO_RECORDS = "0001"


    static success(){
        return new ControllerResponse(code: OK,status: "Success",message: "")
    }
    static noRecords(){
        return new ControllerResponse(code: NO_RECORDS,status: "Success",message: "No records found")
    }


}
