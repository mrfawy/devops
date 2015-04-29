class UrlMappings {

    static mappings = {


        "/envs/$name?" (controller:"setup" ,action : [GET:"retrieveEnvironments",DELETE:"removeEnvironment", POST:"addEnvironment"])


        "/apps/$name?" (controller:"setup" ,action : [GET:"retrieveApps",DELETE:"removeApp", POST:"addApp"])

        "/settings/$env/$app/$token" (controller:"settings" , action : [ GET:"loadTokenSettings",POST:"createTokenSettings", PUT:"updateTokenSettings", DELETE:"removeTokenSettings"])


        "/tokens/$env/$app" (controller:"settings" , action:"retrieveTokens")


        "/users/$user?/$role?"(controller:"setup" , action:[GET:"loadUsers",POST:"createUser",PUT:"assignUsertoRole",DELETE:"removeUser"])

        "/users/password/$userName/$password" (controller:"setup" , action:[PUT:"changeUserPassword"])

        "/session/" (controller:"authentication" , action:"loadSessionData")


        "/analytics/values/$app/$service/$property?" (controller:"analytics" , action:"retrieveStoredValuesForProperty")
        "/analytics/countOwnedTokens" (controller:"analytics" , action:[POST:"countOwnedTokens"])

        //API for Client Apps
        "/api/settings/$env/$app/$token/$service?" (controller:"AppPortal" , action : "loadTokenSettings")
        "/api/settings/default/$env/$app/" (controller:"AppPortal" , action : [ POST:"createDefaultTokenSettings"])
        "/api/settings/template/$app/" (controller:"AppPortal" , action : [ GET:"retrieveAppTemplate"])


        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(controller:"authentication" , action:"index")
        "500"(controller:"error", action:"index")
        "404"(controller:"error",action:"index")
    }
}
