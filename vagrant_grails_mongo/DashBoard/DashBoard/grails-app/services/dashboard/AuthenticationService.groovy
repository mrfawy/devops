package dashboard

import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.FindOneAndReplaceOptions
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
    def loadUsers(role){
        MongoDatabase database=loadDB()
        MongoCollection<Document> usersCollection=database.getCollection(COLLECTION_USERS)
        Document query=new Document()
        if(role){
            query.put("role",role)
        }
        def cursor= usersCollection.find(query).projection(Projections.fields(Projections.exclude("password","_id"))).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result

    }
    def registerUser(userName,password,role){
        MongoDatabase database=loadDB()
        MongoCollection<Document> usersCollection=database.getCollection(COLLECTION_USERS)
        //DBConnectionFactory.envs.insert({name:"DEV"})
        Document doc = new Document("name", userName)
        int count=usersCollection.count(doc)
        if(count>0){
            throw new RuntimeException("User Already exists")
        }
        doc.append("password",password)
        doc.append("role",role)
        usersCollection.insertOne(doc)
        return true

    }
    def assignUserRole(userName,role){
        MongoDatabase database=loadDB()
        MongoCollection<Document> usersCollection=database.getCollection(COLLECTION_USERS)
        Document doc = new Document("name", userName)
        def userDoc=usersCollection.find(doc).first()
        if(!userDoc){
            return false;
        }
        userDoc.put("role",role)
        usersCollection.findOneAndReplace(doc,userDoc)
        return true
    }
    def removeUser(userName){
        MongoDatabase database=loadDB()
        MongoCollection<Document> usersCollection=database.getCollection(COLLECTION_USERS)
        Document doc = new Document("name", userName)
        def userDoc=usersCollection.deleteMany(doc)

    }
}
