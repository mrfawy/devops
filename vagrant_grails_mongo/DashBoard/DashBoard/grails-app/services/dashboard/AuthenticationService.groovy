package dashboard

import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Projections
import grails.core.GrailsApplication
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import org.bson.Document

@Transactional
class AuthenticationService {

    GrailsApplication grailsApplication
    def db

    def COLLECTION_USERS="users"



    def loadDB(){
        if(!db){
            db=DBConnectionFactory.getInstance(grailsApplication)
        }
        return db.loadDBConnection()
    }


    def authenticateUser(userName,password) {
        MongoDatabase database=loadDB()
        MongoCollection<Document> usersCollection=database.getCollection(COLLECTION_USERS)
        Document query=new Document("name",userName)
        query.append("password",password)
        return  usersCollection.find(query).projection(Projections.excludeId())?.first()

    }
}
