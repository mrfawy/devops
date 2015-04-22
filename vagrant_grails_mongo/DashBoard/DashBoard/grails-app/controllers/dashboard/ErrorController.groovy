package dashboard

import grails.converters.JSON

class ErrorController {

    def index() {

        try{
            def exception = request?.exception?.cause

            request?.exception?.printStackTrace()

            response.status = 500

            render new ControllerResponse(code: "0001",status: "FAIL",message: exception?.message,exception:exception) as JSON

        }catch (ex){
            ex.printStackTrace();
           return
        }


    }
}
