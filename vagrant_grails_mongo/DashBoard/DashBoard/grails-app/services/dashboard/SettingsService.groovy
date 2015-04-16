package dashboard

import com.mongodb.MongoClient
import com.mongodb.client.MongoDatabase
import grails.core.GrailsApplication
import grails.transaction.Transactional

@Transactional
class SettingsService {
    GrailsApplication grailsApplication
    def mongoClient;

    def getMongoClient(){
        if(mongoClient){
            return mongoClient
        }
        return initMongoClient()
    }

    def initMongoClient() {
        if (!mongoClient) {
            def host = grailsApplication.config.getProperty('mongodb.host')
            def port = grailsApplication.config.getProperty('mongodb.port')
            mongoClient = new MongoClient(host, port);
        }
        return mongoClient
    }


    def findSettings(def req) {
        def client=getMongoClient();
        MongoDatabase database = client.getDatabase("mydb")
        database.listCollections().each {c->
            print c.toString()
        }
    }
}
