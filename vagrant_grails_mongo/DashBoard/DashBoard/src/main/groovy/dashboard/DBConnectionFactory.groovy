package dashboard

import com.mongodb.MongoClient

/**
 * Created by abdelm2 on 4/18/2015.
 */
class DBConnectionFactory {
    def static me
    def mongoClient
    def database
    def static grailsApplication
    static getInstance(def grailsApp){
        if (!me){
            me=new DBConnectionFactory()
            DBConnectionFactory.grailsApplication=grailsApp
        }
        return me
    }
    def loadMongoClient(){
        if(mongoClient){
            return mongoClient
        }
        return initMongoClient()
    }
    def loadDBConnection(){
        if(!database){
            def db=grailsApplication.config.getProperty('mongodb.db')
            mongoClient=loadMongoClient();
            database=mongoClient.getDatabase(db)
        }
        return database
    }

    def initMongoClient() {
        if (!mongoClient) {
            def host = grailsApplication.config.getProperty('mongodb.host')
            def port = grailsApplication.config.getProperty('mongodb.port')
            mongoClient = new MongoClient(host, port.toInteger());
        }
        return mongoClient
    }
}
