package dashboard

class ControllerResponse {
    def code
    def status
    def message
    def exception

    static def  OK = "0000"
    static def  NO_RECORDS = "0001"
    static def  INVALID_AUTH = "0002"


    static success(){
        return new ControllerResponse(code: OK,status: "Success",message: "")
    }
    static noRecords(){
        return new ControllerResponse(code: NO_RECORDS,status: "Success",message: "No records found")
    }
    static authorizationError(){
        return new ControllerResponse(code: INVALID_AUTH,status: "Error",message: "Invalid Authorization, please login first")
    }


}
