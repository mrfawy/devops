package dashboard

import com.mongodb.BasicDBObject
import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import grails.core.GrailsApplication
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import org.bson.Document

/**
 * {
 "env": "",
 "app": "",
 "userID": "",
 "services": [
 {
 "name": "",
 "properties": [
 {
 "name": "",
 "value": ""
 }
 ]
 }
 ]
 }

 //setup envs
 db.envs.insert({name:"DEV"})
 db.envs.insert({name:"ST"})
 db.envs.insert({name:"PT"})
 db.envs.insert({name:"RT"})

 //setup apps
 db.envs.insert({name:"ME"})
 db.envs.insert({name:"CIL"})


 //insert
 db.userSettings.insert({env:"DEV",app:"ME",userID:"test",services:[{"name":"BAM","properties":[{"name":"REGION","value":"CICSAA"}]}]})

 //load useres belongs to env and app
 db.userSettings.find({env:"DEV",app:"ME"})

 //load certain service settings
 db.userSettings.find({userID:"test","services.name":"BAM"})
 */

@Transactional
class SettingsService {
    GrailsApplication grailsApplication
    def mongoClient
    def database

    def COLLECTION_ENVS="envs"
    def COLLECTION_APPS="apps"
    def COLLECTION_USER_SETTINGSS="userSettings"


    def loadMongoClient(){
        if(mongoClient){
            return mongoClient
        }
        return initMongoClient()
    }
    def loadDataBase(){
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

    def loadEnvs(){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        def cursor= envsCollection.find().iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }
    def loadApps(){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        def cursor = appsCollection.find().iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }

    def loadUsers(def env,def app){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        def cursor = appsCollection.find(query).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }


    def findSettings() {
        MongoDatabase database=loadDataBase()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)

    }
}
