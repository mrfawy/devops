package dashboard

import com.mongodb.BasicDBObject
import com.mongodb.DBObject
import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.FindOneAndReplaceOptions
import com.mongodb.client.model.Projections
import com.mongodb.util.JSON
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
 db.envs.insert({name:"dashboard.templates.ME"})
 db.envs.insert({name:"CIL"})


 //insert
 db.userSettings.insert({env:"DEV",app:"dashboard.templates.ME",userID:"test",services:[{"name":"BAM","properties":[{"name":"REGION","value":"CICSAA"}]}]})

 //load useres belongs to env and app
 db.userSettings.find({env:"DEV",app:"dashboard.templates.ME"})

 //load certain service settings
 db.userSettings.find({userID:"test","services.name":"BAM"})

 //group by env
 db.userSettings.aggregate(
 [
 {
 $group:
 {
 _id: { name: "$env"},
 count: { $sum: 1 }
 }
 }
 ]
 )

 db.userSettings.aggregate(
 [
 {
 $group:
 {
 _id: { name: "$app"},
 count: { $sum: 1 }
 }
 }
 ]
 )
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
        def cursor= envsCollection.find().projection(Projections.excludeId()).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }
    def addEnvironment( name ){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        //db.envs.insert({name:"DEV"})
        Document doc = new Document("name", name)
        envsCollection.insertOne(doc);
    }
    def removeEnvironment(name){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        BasicDBObject query = new BasicDBObject("name",name)
        envsCollection.deleteOne(query);
    }
    def addApp( name ){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        //db.apps.insert({name:"DEV"})
        Document doc = new Document("name", name)
        appsCollection.insertOne(doc);
    }
    def removeApp(name){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        BasicDBObject query = new BasicDBObject("name",name)
        appsCollection.deleteOne(query);
    }
    def loadApps(){
        MongoDatabase database=loadDataBase();
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)

        def cursor = appsCollection.find().projection(Projections.excludeId()).iterator()
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

        def cursor = appsCollection.find(query).projection(Projections.excludeId()).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }


    def loadUserSettings(env,app,userId) {
        MongoDatabase database=loadDataBase()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("userId",userId)



        def cursor = stgCollection.find(query).projection(Projections.excludeId()).iterator()
        def item = cursor.hasNext() ? cursor.next() : null;
        return item

    }
    def upsertUserSettings(setting){
        MongoDatabase database=loadDataBase();
        def appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)


        def criteria=new Document("env",setting.env)
        criteria.append("app",setting.app)
        criteria.append("userId",setting.userId)

        def stgStr=setting as grails.converters.JSON
        def item = Document.parse(stgStr.toString())
        new FindOneAndReplaceOptions(upsert: true)
        appsCollection.findOneAndReplace(criteria,item, new FindOneAndReplaceOptions(upsert: true))
    }
    def removeUserSettings(env,app,userId){
        MongoDatabase database=loadDataBase()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("userId",userId)
        stgCollection.deleteOne(query);
    }
}
