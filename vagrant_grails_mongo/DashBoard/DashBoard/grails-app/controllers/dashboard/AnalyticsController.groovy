package dashboard

import grails.converters.JSON

class AnalyticsController {

    AnalyticsService analyticsService

    def retrieveStoredValuesForProperty() {
        render analyticsService.retrieveStoredValuesForProperty(params.app,params.service,params.property) as JSON
    }
    def countOwnedTokens(){
        def owners=request.JSON.owners
        render analyticsService.countOwnedTokens(owners) as JSON
    }


}
